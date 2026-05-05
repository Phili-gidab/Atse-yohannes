import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { collection, collectionGroup, getDocs, orderBy, query } from 'firebase/firestore';
import { Calendar, Mail, Users as UsersIcon, Phone } from 'lucide-react';
import { db } from '../../config/firebase';

interface Rsvp {
  id: string;
  eventSlug: string;
  eventTitle: string;
  name: string;
  email: string;
  guests: number;
  phone?: string;
  submittedAt?: { seconds: number };
}

const Header = styled.div`
  margin-bottom: 1.5rem;
  h1 { color: var(--color-primary-900); font-size: 1.65rem; margin-bottom: 0.25rem; }
  p { color: var(--color-neutral-600); }
`;

const Tabs = styled.div`
  display: flex; gap: 0.4rem; flex-wrap: wrap;
  margin-bottom: 1.25rem;
  button {
    background: white; border: 1px solid var(--color-neutral-200);
    padding: 0.5rem 0.85rem; border-radius: 999px;
    font-size: 0.85rem; font-weight: 600; cursor: pointer;
    color: var(--color-neutral-700);
    &.active { background: var(--color-primary-900); color: white; border-color: var(--color-primary-900); }
  }
`;

const Card = styled.div`
  background: white; border: 1px solid var(--color-neutral-200);
  border-radius: 12px; padding: 1rem 1.25rem;
  display: grid;
  grid-template-columns: 1.4fr 1.6fr 0.7fr 0.7fr;
  gap: 1rem; align-items: center;
  margin-bottom: 0.6rem;
  font-size: 0.9rem;

  @media (max-width: 800px) { grid-template-columns: 1fr; }

  .name { font-weight: 700; color: var(--color-primary-900); }
  .ev { color: var(--color-neutral-500); font-size: 0.78rem; display: flex; align-items: center; gap: 4px; }
  .meta { color: var(--color-neutral-600); display: flex; align-items: center; gap: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
`;

export const RsvpsManager = () => {
  const [items, setItems] = useState<Rsvp[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<string>('all');

  useEffect(() => {
    if (!db) return;
    (async () => {
      try {
        // collectionGroup query: pulls RSVPs from every event's subcollection.
        const cg = collectionGroup(db!, 'rsvps');
        try {
          const snap = await getDocs(query(cg, orderBy('submittedAt', 'desc')));
          setItems(snap.docs.map((d) => {
            const data = d.data();
            return { id: d.id, eventSlug: d.ref.parent.parent?.id ?? '', ...data } as Rsvp;
          }));
        } catch {
          // collectionGroup may need an index — fall back to per-event scan via /events.
          const evs = await getDocs(collection(db!, 'events'));
          const all: Rsvp[] = [];
          for (const ev of evs.docs) {
            const r = await getDocs(collection(db!, 'events', ev.id, 'rsvps'));
            r.docs.forEach((d) =>
              all.push({ id: d.id, eventSlug: ev.id, ...(d.data() as Omit<Rsvp, 'id' | 'eventSlug'>) })
            );
          }
          setItems(all);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const events = Array.from(new Set(items.map((r) => r.eventTitle).filter(Boolean)));
  const filtered = tab === 'all' ? items : items.filter((r) => r.eventTitle === tab);
  const totalGuests = filtered.reduce((sum, r) => sum + (r.guests ?? 1), 0);

  return (
    <>
      <Header>
        <h1>Event RSVPs</h1>
        <p>{filtered.length} RSVPs · {totalGuests} total guests expected.</p>
      </Header>

      <Tabs>
        <button className={tab === 'all' ? 'active' : ''} onClick={() => setTab('all')}>
          All ({items.length})
        </button>
        {events.map((e) => (
          <button key={e} className={tab === e ? 'active' : ''} onClick={() => setTab(e)}>
            {e}
          </button>
        ))}
      </Tabs>

      {loading && <p>Loading…</p>}
      {!loading && filtered.length === 0 && (
        <p style={{ color: 'var(--color-neutral-500)' }}>No RSVPs yet.</p>
      )}
      {!loading && filtered.map((r) => (
        <Card key={`${r.eventSlug}/${r.id}`}>
          <div>
            <div className="name">{r.name}</div>
            <div className="ev"><Calendar size={11} /> {r.eventTitle}</div>
          </div>
          <div className="meta"><Mail size={13} /> {r.email}</div>
          <div className="meta"><UsersIcon size={13} /> {r.guests} {r.guests === 1 ? 'guest' : 'guests'}</div>
          <div className="meta">{r.phone ? (<><Phone size={13} /> {r.phone}</>) : <span style={{ color: 'var(--color-neutral-400)' }}>—</span>}</div>
        </Card>
      ))}
    </>
  );
};
