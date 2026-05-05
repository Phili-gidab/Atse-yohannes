import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { Search, Eye, EyeOff, ShieldAlert, Mail } from 'lucide-react';
import { db } from '../../config/firebase';

interface Member {
  id: string;
  email: string;
  fullName?: string;
  graduationYear?: string;
  currentLocation?: string;
  chapter?: string;
  publicInDirectory?: boolean;
}

const Header = styled.div`
  margin-bottom: 1.5rem;
  h1 { color: var(--color-primary-900); font-size: 1.65rem; margin-bottom: 0.25rem; }
  p { color: var(--color-neutral-600); }
`;

const SearchBar = styled.div`
  background: white;
  border: 1px solid var(--color-neutral-200);
  border-radius: 12px;
  padding: 0.5rem 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;

  input { flex: 1; border: none; outline: none; font-size: 0.92rem; background: transparent; }
`;

const Table = styled.div`
  background: white;
  border: 1px solid var(--color-neutral-200);
  border-radius: 14px;
  overflow: hidden;

  .row {
    display: grid;
    grid-template-columns: 1.5fr 1.2fr 1fr 0.8fr auto;
    gap: 1rem;
    padding: 0.95rem 1.25rem;
    align-items: center;
    border-bottom: 1px solid var(--color-neutral-100);
    font-size: 0.9rem;

    &:last-child { border-bottom: none; }
    &.head {
      background: var(--color-neutral-50);
      font-size: 0.74rem;
      font-weight: 700;
      color: var(--color-neutral-500);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .name { font-weight: 700; color: var(--color-primary-900); }
    .email { color: var(--color-neutral-600); display: inline-flex; align-items: center; gap: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .pill {
      padding: 0.25rem 0.6rem;
      border-radius: 999px;
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: inline-flex; align-items: center; gap: 4px;
    }
    .pill.public { background: #dcfce7; color: #166534; }
    .pill.private { background: var(--color-neutral-100); color: var(--color-neutral-600); }
    button.toggle {
      background: white; border: 1px solid var(--color-neutral-200);
      padding: 0.45rem 0.7rem; border-radius: 8px;
      font-size: 0.82rem; font-weight: 600; cursor: pointer;
      display: inline-flex; align-items: center; gap: 4px;
      &:hover { border-color: var(--color-secondary-400); color: var(--color-secondary-700); }
    }
  }

  @media (max-width: 800px) {
    .row { grid-template-columns: 1fr 1fr; }
    .row .meta { display: none; }
    .row.head { display: none; }
  }
`;

export const MembersManager = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  const load = async () => {
    if (!db) return;
    setLoading(true);
    try {
      const ref = collection(db, 'members');
      const snap = await getDocs(query(ref, orderBy('fullName')));
      setMembers(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Member));
    } catch {
      // Some docs may not have fullName indexed; fall back to unsorted.
      const snap = await getDocs(collection(db, 'members'));
      setMembers(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Member));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const toggleVisibility = async (m: Member) => {
    if (!db) return;
    await updateDoc(doc(db, 'members', m.id), {
      publicInDirectory: !m.publicInDirectory,
    });
    setMembers((arr) => arr.map((x) => (x.id === m.id ? { ...x, publicInDirectory: !m.publicInDirectory } : x)));
  };

  const filtered = members.filter((m) => {
    const s = q.toLowerCase();
    return (
      !s ||
      m.fullName?.toLowerCase().includes(s) ||
      m.email?.toLowerCase().includes(s) ||
      m.currentLocation?.toLowerCase().includes(s) ||
      m.chapter?.toLowerCase().includes(s)
    );
  });

  return (
    <>
      <Header>
        <h1>Members</h1>
        <p>{members.length} members. Toggle directory visibility per member.</p>
      </Header>

      <SearchBar>
        <Search size={16} />
        <input
          placeholder="Search by name, email, location, chapter…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </SearchBar>

      {loading && <p>Loading…</p>}
      {!loading && (
        <Table>
          <div className="row head">
            <div>Name</div>
            <div>Email</div>
            <div>Location</div>
            <div>Directory</div>
            <div></div>
          </div>
          {filtered.map((m) => (
            <div className="row" key={m.id}>
              <div>
                <div className="name">{m.fullName ?? '—'}</div>
                <div style={{ color: 'var(--color-neutral-500)', fontSize: '0.78rem' }}>
                  {m.chapter ?? ''} {m.graduationYear ? `· ${m.graduationYear}` : ''}
                </div>
              </div>
              <div className="email"><Mail size={13} /> {m.email}</div>
              <div className="meta" style={{ color: 'var(--color-neutral-600)' }}>{m.currentLocation ?? '—'}</div>
              <div>
                <span className={`pill ${m.publicInDirectory ? 'public' : 'private'}`}>
                  {m.publicInDirectory ? <Eye size={11} /> : <EyeOff size={11} />}
                  {m.publicInDirectory ? 'Public' : 'Private'}
                </span>
              </div>
              <div>
                <button className="toggle" onClick={() => toggleVisibility(m)}>
                  <ShieldAlert size={13} /> Toggle
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="row"><div style={{ color: 'var(--color-neutral-500)' }}>No members match.</div></div>
          )}
        </Table>
      )}
    </>
  );
};
