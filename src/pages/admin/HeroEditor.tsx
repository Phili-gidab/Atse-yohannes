import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useQueryClient } from '@tanstack/react-query';
import { Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { db } from '../../config/firebase';
import { HERO } from '../../data/content';
import { ImageUpload } from '../../components/admin/ImageUpload';

interface HeroDoc {
  eyebrow: string;
  headline: string;
  subtext: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  backgroundImage?: string;
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

  fieldset {
    border: 1px solid var(--color-neutral-200);
    border-radius: 12px;
    padding: 1rem 1.25rem 1.25rem;
    legend {
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--color-secondary-700);
      padding: 0 0.5rem;
    }
    .pair { margin-top: 0.5rem; }
  }
`;

export const HeroEditor = () => {
  const qc = useQueryClient();
  const [data, setData] = useState<HeroDoc>({
    eyebrow: HERO.eyebrow,
    headline: HERO.headline,
    subtext: HERO.subtext,
    primaryCta: { ...HERO.primaryCta },
    secondaryCta: { ...HERO.secondaryCta },
    backgroundImage: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!db) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db!, 'content/hero'));
        if (snap.exists()) {
          const d = snap.data() as Partial<HeroDoc>;
          setData((cur) => ({ ...cur, ...d }));
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const update = <K extends keyof HeroDoc>(k: K, v: HeroDoc[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    setSaving(true);
    setSaved(false);
    setErr(null);
    try {
      await setDoc(doc(db, 'content/hero'), { ...data, updatedAt: serverTimestamp() }, { merge: true });
      await qc.invalidateQueries({ queryKey: ['hero'] });
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
        <h1>Hero Section</h1>
        <p>Edit the homepage hero — headline, subtext, CTAs, and background image.</p>
      </Header>

      <Form onSubmit={handle}>
        {loading && <p>Loading…</p>}
        {!loading && (
          <>
            <div className="row">
              <label>Eyebrow text</label>
              <input
                type="text"
                value={data.eyebrow}
                onChange={(e) => update('eyebrow', e.target.value)}
                placeholder="Atse Yohannes Alumni Association"
              />
            </div>

            <div className="row">
              <label>Headline</label>
              <input
                type="text"
                value={data.headline}
                onChange={(e) => update('headline', e.target.value)}
              />
            </div>

            <div className="row">
              <label>Subtext</label>
              <textarea
                value={data.subtext}
                onChange={(e) => update('subtext', e.target.value)}
              />
            </div>

            <div className="row">
              <label>Background image</label>
              <ImageUpload
                value={data.backgroundImage}
                onChange={(url) => update('backgroundImage', url)}
                folder="site/hero"
                hint="or paste an image URL"
              />
            </div>

            <fieldset>
              <legend>Primary CTA</legend>
              <div className="pair">
                <div className="row">
                  <label>Label</label>
                  <input
                    type="text"
                    value={data.primaryCta.label}
                    onChange={(e) =>
                      update('primaryCta', { ...data.primaryCta, label: e.target.value })
                    }
                  />
                </div>
                <div className="row">
                  <label>Link</label>
                  <input
                    type="text"
                    value={data.primaryCta.href}
                    onChange={(e) =>
                      update('primaryCta', { ...data.primaryCta, href: e.target.value })
                    }
                  />
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend>Secondary CTA</legend>
              <div className="pair">
                <div className="row">
                  <label>Label</label>
                  <input
                    type="text"
                    value={data.secondaryCta.label}
                    onChange={(e) =>
                      update('secondaryCta', { ...data.secondaryCta, label: e.target.value })
                    }
                  />
                </div>
                <div className="row">
                  <label>Link</label>
                  <input
                    type="text"
                    value={data.secondaryCta.href}
                    onChange={(e) =>
                      update('secondaryCta', { ...data.secondaryCta, href: e.target.value })
                    }
                  />
                </div>
              </div>
            </fieldset>

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
