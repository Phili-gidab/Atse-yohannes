import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { collection, getCountFromServer } from 'firebase/firestore';
import {
  Briefcase,
  Newspaper,
  Calendar,
  Users,
  HeartHandshake,
  BookOpen,
  Database,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { db } from '../../config/firebase';
import { useAuth } from '../../hooks/useAuth';
import { seedFirestore, type SeedResult } from '../../services/seed.service';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 2rem;
  margin-bottom: 2rem;

  h1 { color: var(--color-primary-900); margin-bottom: 0.25rem; font-size: 1.85rem; }
  p { color: var(--color-neutral-600); }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2.5rem;
`;

const Stat = styled(Link)`
  background: white;
  border-radius: 14px;
  padding: 1.25rem;
  border: 1px solid var(--color-neutral-200);
  text-decoration: none;
  transition: all 0.2s ease;
  display: block;

  .top {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    color: var(--color-neutral-500);
    font-size: 0.82rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 700;
    margin-bottom: 0.6rem;
  }
  .num {
    font-family: var(--font-heading);
    font-weight: 800;
    font-size: 2rem;
    color: var(--color-primary-900);
    line-height: 1;
  }
  .lbl {
    color: var(--color-neutral-500);
    font-size: 0.85rem;
    margin-top: 0.4rem;
  }

  &:hover {
    border-color: var(--color-secondary-300);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
`;

const SeedCard = styled.div`
  background: white;
  border: 1px dashed var(--color-secondary-300);
  border-radius: 14px;
  padding: 1.5rem;
  margin-bottom: 2rem;

  h3 { color: var(--color-primary-900); margin-bottom: 0.4rem; }
  p { color: var(--color-neutral-600); font-size: 0.92rem; margin-bottom: 1rem; }

  button {
    background: linear-gradient(135deg, var(--color-secondary-500), var(--color-secondary-700));
    color: white;
    border: none;
    padding: 0.7rem 1.1rem;
    border-radius: 10px;
    font-weight: 700;
    font-size: 0.9rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    &:hover { transform: translateY(-2px); }
    &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  }

  .results {
    margin-top: 1rem;
    background: var(--color-neutral-50);
    padding: 1rem;
    border-radius: 10px;
    font-size: 0.85rem;
    display: grid;
    gap: 0.4rem;

    .row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.5rem;
      .meta { color: var(--color-neutral-500); font-size: 0.78rem; }
    }
  }

  .err {
    background: #fee2e2;
    color: #991b1b;
    padding: 0.7rem 0.85rem;
    border-radius: 10px;
    margin-top: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

interface Counts {
  programs: number;
  projects: number;
  news: number;
  events: number;
  leadership: number;
  resources: number;
}

const initialCounts: Counts = {
  programs: 0,
  projects: 0,
  news: 0,
  events: 0,
  leadership: 0,
  resources: 0,
};

export const Dashboard = () => {
  const { user } = useAuth();
  const [counts, setCounts] = useState<Counts>(initialCounts);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedResults, setSeedResults] = useState<SeedResult[] | null>(null);
  const [seedErr, setSeedErr] = useState<string | null>(null);

  const loadCounts = async () => {
    if (!db) return;
    try {
      const collections = Object.keys(initialCounts) as Array<keyof Counts>;
      const next: Counts = { ...initialCounts };
      await Promise.all(
        collections.map(async (name) => {
          const snap = await getCountFromServer(collection(db!, name));
          next[name] = snap.data().count;
        })
      );
      setCounts(next);
    } catch (e) {
      console.error('count load failed', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCounts();
  }, []);

  const handleSeed = async () => {
    setSeeding(true);
    setSeedErr(null);
    setSeedResults(null);
    try {
      const r = await seedFirestore();
      setSeedResults(r);
      await loadCounts();
    } catch (e) {
      setSeedErr((e as Error).message);
    } finally {
      setSeeding(false);
    }
  };

  const stats = [
    { key: 'programs', label: 'Programs', icon: HeartHandshake, to: '/admin/programs' },
    { key: 'projects', label: 'Projects', icon: Briefcase, to: '/admin/projects' },
    { key: 'news', label: 'News & Updates', icon: Newspaper, to: '/admin/news' },
    { key: 'events', label: 'Events', icon: Calendar, to: '/admin/events' },
    { key: 'leadership', label: 'Leadership', icon: Users, to: '/admin/leadership' },
    { key: 'resources', label: 'Resources', icon: BookOpen, to: '/admin/resources' },
  ] as const;

  const totalDocs = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <>
      <Header>
        <div>
          <h1>Welcome back{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}.</h1>
          <p>Manage AYAA content, members, and events from here.</p>
        </div>
      </Header>

      {totalDocs === 0 && !loading && (
        <SeedCard>
          <h3>Your Firestore is empty</h3>
          <p>
            Click below to copy the existing seed content (programs, projects, news, events,
            leadership, etc.) into Firestore. This is safe to run multiple times — existing
            documents won't be overwritten.
          </p>
          <button onClick={handleSeed} disabled={seeding}>
            <Database size={16} />
            {seeding ? 'Seeding…' : 'Seed Firestore from local content'}
            <ArrowRight size={14} />
          </button>
          {seedErr && (
            <div className="err">
              <AlertCircle size={16} /> {seedErr}
            </div>
          )}
          {seedResults && (
            <div className="results">
              {seedResults.map((r) => (
                <div className="row" key={r.collection}>
                  <span>
                    <CheckCircle2 size={14} style={{ color: 'var(--color-success)', verticalAlign: 'middle', marginRight: 6 }} />
                    {r.collection}
                  </span>
                  <span className="meta">
                    {r.written} written · {r.skipped} skipped
                  </span>
                </div>
              ))}
            </div>
          )}
        </SeedCard>
      )}

      <Grid>
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Stat key={s.key} to={s.to}>
              <div className="top"><Icon size={14} /> {s.label}</div>
              <div className="num">{loading ? '…' : counts[s.key]}</div>
              <div className="lbl">documents</div>
            </Stat>
          );
        })}
      </Grid>
    </>
  );
};
