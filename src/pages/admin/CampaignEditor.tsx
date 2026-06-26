import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useQueryClient } from '@tanstack/react-query';
import { Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { db } from '../../config/firebase';
import { CAMPAIGN } from '../../data/content';

interface CampaignDoc {
  headline: string;
  bannerDescription: string;
  title: string;
  raised: number;
  goal: number;
  description: string;
  benefits: string[];
}

const Header = styled.div`
  margin-bottom: 1.5rem;
  h1 { color: var(--color-primary-900); margin-bottom: 0.25rem; font-size: 1.65rem; }
  p { color: var(--color-neutral-600); }
`;

const Form = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid var(--color-neutral-200);
  display: grid;
  gap: 1.25rem;
  max-width: 760px;

  .row { display: grid; gap: 0.4rem; }
  label {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--color-neutral-700);
  }
  input, textarea {
    width: 100%;
    padding: 0.7rem 0.85rem;
    border: 1px solid var(--color-neutral-300);
    border-radius: 10px;
    font-size: 0.95rem;
    font-family: inherit;
    &:focus {
      outline: none;
      border-color: var(--color-secondary-500);
      box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.18);
    }
  }
  textarea { min-height: 90px; resize: vertical; }

  .pair {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    @media (max-width: 600px) { grid-template-columns: 1fr; }
  }

  .helper { font-size: 0.78rem; color: var(--color-neutral-500); }

  .group {
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--color-secondary-700);
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--color-neutral-200);
    margin-top: 0.5rem;
    &:first-of-type { margin-top: 0; }
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 0.5rem;
    button {
      background: linear-gradient(135deg, var(--color-secondary-500), var(--color-secondary-700));
      color: white;
      border: none;
      padding: 0.75rem 1.2rem;
      border-radius: 10px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      &:disabled { opacity: 0.6; cursor: not-allowed; }
      &:hover:not(:disabled) { transform: translateY(-2px); }
    }
    .ok { color: var(--color-success); display: inline-flex; align-items: center; gap: 0.4rem; font-weight: 600; }
    .err { color: var(--color-error); display: inline-flex; align-items: center; gap: 0.4rem; font-weight: 600; }
  }
`;

const Preview = styled.div`
  background: linear-gradient(135deg, var(--color-primary-900), var(--color-primary-800));
  color: white;
  border-radius: 14px;
  padding: 1.25rem 1.4rem;

  .label { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.6; margin-bottom: 0.5rem; }
  .row { display: flex; justify-content: space-between; font-size: 0.82rem; opacity: 0.85; margin-bottom: 0.4rem; }
  .bar { height: 8px; background: rgba(255,255,255,0.12); border-radius: 999px; overflow: hidden; }
  .fill { height: 100%; background: linear-gradient(90deg, var(--color-accent-400), var(--color-accent-600)); }
`;

export const CampaignEditor = () => {
  const qc = useQueryClient();
  const [data, setData] = useState<CampaignDoc>({ ...CAMPAIGN });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!db) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db!, 'content/campaign'));
        if (snap.exists()) {
          const d = snap.data() as Partial<CampaignDoc>;
          setData((cur) => ({ ...cur, ...d }));
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const update = <K extends keyof CampaignDoc>(k: K, v: CampaignDoc[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const pct = data.goal > 0 ? Math.min(100, Math.round((data.raised / data.goal) * 100)) : 0;

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    setSaving(true);
    setSaved(false);
    setErr(null);
    try {
      const payload = {
        ...data,
        raised: Number(data.raised) || 0,
        goal: Number(data.goal) || 0,
        benefits: data.benefits.map((b) => b.trim()).filter(Boolean),
        updatedAt: serverTimestamp(),
      };
      await setDoc(doc(db, 'content/campaign'), payload, { merge: true });
      await qc.invalidateQueries({ queryKey: ['campaign'] });
      setSaved(true);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Header>
        <h1>Donation Campaign</h1>
        <p>Edit the fundraising progress card shown in the Donate page sidebar.</p>
      </Header>

      <Form onSubmit={handle}>
        {loading && <p>Loading…</p>}
        {!loading && (
          <>
            <div className="group">Homepage banner</div>

            <div className="row">
              <label>Banner headline</label>
              <input
                type="text"
                value={data.headline}
                onChange={(e) => update('headline', e.target.value)}
                placeholder="Help Us Equip the Library Media Center"
              />
            </div>

            <div className="row">
              <label>Banner description</label>
              <textarea
                value={data.bannerDescription}
                onChange={(e) => update('bannerDescription', e.target.value)}
              />
              <span className="helper">Shown in the homepage “Active Campaign” banner.</span>
            </div>

            <div className="group">Donate page card</div>

            <div className="row">
              <label>Card title</label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="Library Media Center Campaign"
              />
            </div>

            <div className="row">
              <label>Card description</label>
              <textarea
                value={data.description}
                onChange={(e) => update('description', e.target.value)}
              />
            </div>

            <div className="row">
              <label>Benefits (one per line)</label>
              <textarea
                value={data.benefits.join('\n')}
                onChange={(e) => update('benefits', e.target.value.split('\n'))}
                placeholder={'100% of funds go to school projects\nTax-deductible (where applicable)'}
              />
              <span className="helper">Each line becomes a checkmark bullet in the sidebar.</span>
            </div>

            <div className="group">Fundraising progress</div>

            <div className="pair">
              <div className="row">
                <label>Amount raised (USD)</label>
                <input
                  type="number"
                  min="0"
                  value={data.raised}
                  onChange={(e) => update('raised', Number(e.target.value))}
                />
              </div>
              <div className="row">
                <label>Goal (USD)</label>
                <input
                  type="number"
                  min="0"
                  value={data.goal}
                  onChange={(e) => update('goal', Number(e.target.value))}
                />
              </div>
            </div>

            <Preview>
              <div className="label">Live preview</div>
              <div className="row">
                <span>${(Number(data.raised) || 0).toLocaleString()} raised</span>
                <span>{pct}%</span>
              </div>
              <div className="bar"><div className="fill" style={{ width: `${pct}%` }} /></div>
            </Preview>

            <div className="actions">
              <button type="submit" disabled={saving}>
                <Save size={16} /> {saving ? 'Saving…' : 'Save changes'}
              </button>
              {saved && <span className="ok"><CheckCircle2 size={16} /> Saved</span>}
              {err && <span className="err"><AlertCircle size={16} /> {err}</span>}
            </div>
          </>
        )}
      </Form>
    </>
  );
};
