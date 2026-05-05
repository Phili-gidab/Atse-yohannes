import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { collection, doc, getDocs, orderBy, query, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { CheckCircle2, X, Mail, MapPin, Briefcase, Calendar } from 'lucide-react';
import { db } from '../../config/firebase';

interface Application {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  graduationYear: string;
  currentLocation: string;
  occupation: string;
  phone: string;
  notes: string;
  chapter: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt?: { seconds: number };
}

const Header = styled.div`
  margin-bottom: 1.5rem;
  h1 { color: var(--color-primary-900); font-size: 1.65rem; margin-bottom: 0.25rem; }
  p { color: var(--color-neutral-600); }
`;

const Tabs = styled.div`
  display: flex;
  gap: 0.4rem;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid var(--color-neutral-200);
  button {
    background: none;
    border: none;
    padding: 0.7rem 1rem;
    font-weight: 700;
    font-size: 0.92rem;
    color: var(--color-neutral-500);
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    &.active {
      color: var(--color-primary-900);
      border-bottom-color: var(--color-secondary-500);
    }
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 14px;
  border: 1px solid var(--color-neutral-200);
  padding: 1.25rem 1.5rem;
  margin-bottom: 1rem;

  .top {
    display: flex; justify-content: space-between; align-items: start;
    gap: 1rem; margin-bottom: 0.6rem;
    .name { font-family: var(--font-heading); color: var(--color-primary-900); font-weight: 700; font-size: 1.05rem; }
    .pill {
      padding: 0.25rem 0.7rem; border-radius: 999px;
      font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
    }
    .pill.pending { background: #fef3c7; color: #92400e; }
    .pill.approved { background: #dcfce7; color: #166534; }
    .pill.rejected { background: #fee2e2; color: #991b1b; }
  }
  .meta {
    display: flex; gap: 1rem; flex-wrap: wrap;
    color: var(--color-neutral-600); font-size: 0.85rem; margin-bottom: 0.65rem;
    span { display: inline-flex; align-items: center; gap: 4px; }
  }
  .notes {
    background: var(--color-neutral-50);
    padding: 0.65rem 0.85rem;
    border-radius: 8px;
    font-size: 0.85rem;
    color: var(--color-neutral-700);
    margin-bottom: 0.85rem;
  }
  .actions { display: flex; gap: 0.5rem; }
  button.act {
    padding: 0.45rem 0.85rem;
    border-radius: 8px; border: 1px solid;
    font-size: 0.85rem; font-weight: 700; cursor: pointer;
    display: inline-flex; align-items: center; gap: 0.35rem;
    &:disabled { opacity: 0.6; cursor: not-allowed; }
  }
  button.approve { background: var(--color-success); color: white; border-color: var(--color-success); &:hover { filter: brightness(1.1); } }
  button.reject  { background: white; color: var(--color-error); border-color: var(--color-neutral-200); &:hover { background: #fef2f2; border-color: #fca5a5; } }
`;

export const ApplicationsManager = () => {
  const [items, setItems] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [acting, setActing] = useState<string | null>(null);

  const load = async () => {
    if (!db) return;
    setLoading(true);
    try {
      const ref = collection(db, 'membershipApplications');
      const q = query(ref, orderBy('submittedAt', 'desc'));
      const snap = await getDocs(q);
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Application));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const decide = async (app: Application, status: 'approved' | 'rejected') => {
    if (!db) return;
    setActing(app.id);
    try {
      await updateDoc(doc(db, 'membershipApplications', app.id), {
        status,
        decidedAt: serverTimestamp(),
      });
      if (status === 'approved') {
        // Promote user to member, create their member directory entry.
        await updateDoc(doc(db, 'users', app.userId), { role: 'member' });
        await setDoc(
          doc(db, 'members', app.userId),
          {
            email: app.email,
            fullName: app.fullName,
            graduationYear: app.graduationYear,
            currentLocation: app.currentLocation,
            occupation: app.occupation,
            phone: app.phone,
            chapter: app.chapter,
            publicInDirectory: false,
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );
      }
      await load();
    } finally {
      setActing(null);
    }
  };

  const filtered = items.filter((a) => (tab === 'all' ? true : a.status === tab));
  const counts = {
    pending: items.filter((a) => a.status === 'pending').length,
    approved: items.filter((a) => a.status === 'approved').length,
    rejected: items.filter((a) => a.status === 'rejected').length,
  };

  return (
    <>
      <Header>
        <h1>Membership Applications</h1>
        <p>Review and approve new member applications.</p>
      </Header>

      <Tabs>
        <button className={tab === 'pending' ? 'active' : ''} onClick={() => setTab('pending')}>
          Pending ({counts.pending})
        </button>
        <button className={tab === 'approved' ? 'active' : ''} onClick={() => setTab('approved')}>
          Approved ({counts.approved})
        </button>
        <button className={tab === 'rejected' ? 'active' : ''} onClick={() => setTab('rejected')}>
          Rejected ({counts.rejected})
        </button>
        <button className={tab === 'all' ? 'active' : ''} onClick={() => setTab('all')}>
          All ({items.length})
        </button>
      </Tabs>

      {loading && <p>Loading…</p>}
      {!loading && filtered.length === 0 && (
        <p style={{ color: 'var(--color-neutral-500)' }}>No applications in this view.</p>
      )}
      {!loading && filtered.map((app) => (
        <Card key={app.id}>
          <div className="top">
            <div>
              <div className="name">{app.fullName}</div>
              <div style={{ color: 'var(--color-neutral-500)', fontSize: '0.85rem' }}>
                Chapter: {app.chapter}
              </div>
            </div>
            <span className={`pill ${app.status}`}>{app.status}</span>
          </div>
          <div className="meta">
            <span><Mail size={13} /> {app.email}</span>
            <span><Calendar size={13} /> Class of {app.graduationYear}</span>
            <span><MapPin size={13} /> {app.currentLocation}</span>
            {app.occupation && <span><Briefcase size={13} /> {app.occupation}</span>}
          </div>
          {app.notes && <div className="notes">{app.notes}</div>}
          {app.status === 'pending' && (
            <div className="actions">
              <button
                className="act approve"
                onClick={() => decide(app, 'approved')}
                disabled={acting === app.id}
              >
                <CheckCircle2 size={14} /> Approve
              </button>
              <button
                className="act reject"
                onClick={() => decide(app, 'rejected')}
                disabled={acting === app.id}
              >
                <X size={14} /> Reject
              </button>
            </div>
          )}
        </Card>
      ))}
    </>
  );
};
