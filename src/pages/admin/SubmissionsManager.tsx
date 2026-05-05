import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { collection, doc, getDocs, orderBy, query, updateDoc, deleteDoc } from 'firebase/firestore';
import { Mail, Calendar, Tag, Trash2, CheckCircle2, MessageSquare } from 'lucide-react';
import { db } from '../../config/firebase';

interface Submission {
  id: string;
  name: string;
  email: string;
  subject: string;
  type: string;
  message: string;
  status?: 'new' | 'replied' | 'archived';
  submittedAt?: { seconds: number };
}

interface NewsletterSub {
  id: string;
  email: string;
  submittedAt?: { seconds: number };
}

const Header = styled.div`
  margin-bottom: 1.5rem;
  h1 { color: var(--color-primary-900); font-size: 1.65rem; margin-bottom: 0.25rem; }
  p { color: var(--color-neutral-600); }
`;

const Tabs = styled.div`
  display: flex; gap: 0.4rem;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid var(--color-neutral-200);
  button {
    background: none; border: none;
    padding: 0.7rem 1rem;
    font-weight: 700; font-size: 0.92rem;
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
  border: 1px solid var(--color-neutral-200);
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 0.75rem;

  .top { display: flex; justify-content: space-between; align-items: start; gap: 1rem; margin-bottom: 0.5rem; }
  .name { font-weight: 700; color: var(--color-primary-900); }
  .meta { color: var(--color-neutral-500); font-size: 0.8rem; display: flex; flex-wrap: wrap; gap: 0.85rem; margin-top: 0.2rem;
    span { display: inline-flex; align-items: center; gap: 4px; }
  }
  .subj { font-weight: 600; color: var(--color-primary-900); margin: 0.6rem 0 0.3rem; }
  .msg { color: var(--color-neutral-700); font-size: 0.92rem; white-space: pre-wrap; }

  .actions { display: flex; gap: 0.4rem; margin-top: 0.85rem; }
  button {
    padding: 0.4rem 0.7rem; border-radius: 8px;
    font-size: 0.82rem; font-weight: 600; cursor: pointer;
    display: inline-flex; align-items: center; gap: 4px;
    background: white; border: 1px solid var(--color-neutral-200);
    color: var(--color-neutral-700);
    &:hover { border-color: var(--color-secondary-400); color: var(--color-secondary-700); }
    &.del:hover { border-color: #fca5a5; color: var(--color-error); background: #fef2f2; }
  }
  .pill {
    padding: 0.2rem 0.55rem; border-radius: 999px;
    font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
  }
  .pill.new { background: #fef3c7; color: #92400e; }
  .pill.replied { background: #dcfce7; color: #166534; }
  .pill.archived { background: var(--color-neutral-100); color: var(--color-neutral-600); }
`;

const NewsletterCard = styled.div`
  background: white;
  border: 1px solid var(--color-neutral-200);
  border-radius: 12px;
  padding: 0.75rem 1.25rem;
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  margin-bottom: 0.5rem;
  font-size: 0.92rem;
  .email { font-weight: 600; color: var(--color-primary-900); }
  .when { color: var(--color-neutral-500); font-size: 0.82rem; }
`;

export const SubmissionsManager = () => {
  const [tab, setTab] = useState<'contact' | 'newsletter'>('contact');
  const [contact, setContact] = useState<Submission[]>([]);
  const [news, setNews] = useState<NewsletterSub[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!db) return;
    setLoading(true);
    try {
      const [c, n] = await Promise.all([
        getDocs(query(collection(db, 'contactSubmissions'), orderBy('submittedAt', 'desc'))),
        getDocs(query(collection(db, 'newsletterSubscriptions'), orderBy('submittedAt', 'desc'))),
      ]);
      setContact(c.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Submission, 'id'>) })));
      setNews(n.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<NewsletterSub, 'id'>) })));
    } catch {
      // collections may not exist yet — leave empty
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const updateStatus = async (id: string, status: 'replied' | 'archived') => {
    if (!db) return;
    await updateDoc(doc(db, 'contactSubmissions', id), { status });
    setContact((arr) => arr.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  const remove = async (col: 'contactSubmissions' | 'newsletterSubscriptions', id: string) => {
    if (!db) return;
    if (!confirm('Delete this entry?')) return;
    await deleteDoc(doc(db, col, id));
    if (col === 'contactSubmissions') setContact((arr) => arr.filter((c) => c.id !== id));
    else setNews((arr) => arr.filter((n) => n.id !== id));
  };

  const exportCsv = () => {
    const csv = ['email,subscribed_at', ...news.map((n) => `${n.email},${n.submittedAt?.seconds ? new Date(n.submittedAt.seconds * 1000).toISOString() : ''}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter-subscribers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Header>
        <h1>Inbox</h1>
        <p>Contact form messages and newsletter subscribers.</p>
      </Header>

      <Tabs>
        <button className={tab === 'contact' ? 'active' : ''} onClick={() => setTab('contact')}>
          Contact ({contact.length})
        </button>
        <button className={tab === 'newsletter' ? 'active' : ''} onClick={() => setTab('newsletter')}>
          Newsletter ({news.length})
        </button>
      </Tabs>

      {loading && <p>Loading…</p>}

      {!loading && tab === 'contact' && contact.length === 0 && (
        <p style={{ color: 'var(--color-neutral-500)' }}>No contact form submissions yet.</p>
      )}
      {!loading && tab === 'contact' && contact.map((s) => (
        <Card key={s.id}>
          <div className="top">
            <div>
              <div className="name">{s.name}</div>
              <div className="meta">
                <span><Mail size={12} /> {s.email}</span>
                <span><Tag size={12} /> {s.type}</span>
                {s.submittedAt?.seconds && (
                  <span><Calendar size={12} /> {new Date(s.submittedAt.seconds * 1000).toLocaleString()}</span>
                )}
              </div>
            </div>
            <span className={`pill ${s.status ?? 'new'}`}>{s.status ?? 'new'}</span>
          </div>
          <div className="subj">{s.subject}</div>
          <div className="msg">{s.message}</div>
          <div className="actions">
            <button onClick={() => window.location.assign(`mailto:${s.email}?subject=Re:${encodeURIComponent(s.subject)}`)}>
              <Mail size={13} /> Reply via email
            </button>
            <button onClick={() => updateStatus(s.id, 'replied')}>
              <CheckCircle2 size={13} /> Mark replied
            </button>
            <button onClick={() => updateStatus(s.id, 'archived')}>
              <MessageSquare size={13} /> Archive
            </button>
            <button className="del" onClick={() => remove('contactSubmissions', s.id)}>
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </Card>
      ))}

      {!loading && tab === 'newsletter' && (
        <>
          {news.length === 0 ? (
            <p style={{ color: 'var(--color-neutral-500)' }}>No subscribers yet.</p>
          ) : (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <button onClick={exportCsv} style={{ background: 'var(--color-primary-900)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>
                  Export CSV
                </button>
              </div>
              {news.map((n) => (
                <NewsletterCard key={n.id}>
                  <div>
                    <div className="email">{n.email}</div>
                    <div className="when">
                      {n.submittedAt?.seconds && new Date(n.submittedAt.seconds * 1000).toLocaleString()}
                    </div>
                  </div>
                  <button onClick={() => remove('newsletterSubscriptions', n.id)} style={{ background: 'white', border: '1px solid var(--color-neutral-200)', padding: '0.4rem 0.7rem', borderRadius: 8, cursor: 'pointer', color: 'var(--color-neutral-600)' }}>
                    <Trash2 size={13} />
                  </button>
                </NewsletterCard>
              ))}
            </>
          )}
        </>
      )}
    </>
  );
};
