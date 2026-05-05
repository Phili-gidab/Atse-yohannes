import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useQueryClient } from '@tanstack/react-query';
import { Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { db } from '../../config/firebase';
import { ORG, OUR_STORY, STORY } from '../../data/content';

const Header = styled.div`
  margin-bottom: 1.5rem;
  h1 { color: var(--color-primary-900); margin-bottom: 0.25rem; font-size: 1.65rem; }
  p { color: var(--color-neutral-600); }
`;

const Card = styled.section`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid var(--color-neutral-200);
  margin-bottom: 1.5rem;
  max-width: 760px;

  h2 { color: var(--color-primary-900); margin-bottom: 1rem; font-size: 1.1rem; }
  .grid { display: grid; gap: 1rem; }
  .pair { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; @media (max-width: 600px) { grid-template-columns: 1fr; } }
  label { font-size: 0.85rem; font-weight: 600; color: var(--color-neutral-700); display: block; margin-bottom: 0.3rem; }
  input, textarea {
    width: 100%;
    padding: 0.65rem 0.8rem;
    border: 1px solid var(--color-neutral-300);
    border-radius: 10px;
    font-size: 0.93rem;
    font-family: inherit;
    &:focus { outline: none; border-color: var(--color-secondary-500); box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.18); }
  }
  textarea { min-height: 110px; resize: vertical; }
`;

const Bar = styled.div`
  position: sticky;
  bottom: 0;
  background: white;
  padding: 1rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;

  button {
    background: linear-gradient(135deg, var(--color-secondary-500), var(--color-secondary-700));
    color: white;
    border: none;
    padding: 0.75rem 1.2rem;
    border-radius: 10px;
    font-weight: 700;
    cursor: pointer;
    display: inline-flex; align-items: center; gap: 0.45rem;
    &:disabled { opacity: 0.6; cursor: not-allowed; }
    &:hover:not(:disabled) { transform: translateY(-2px); }
  }
  .ok { color: var(--color-success); display: inline-flex; align-items: center; gap: 0.4rem; font-weight: 600; }
  .err { color: var(--color-error); display: inline-flex; align-items: center; gap: 0.4rem; font-weight: 600; }
`;

interface OrgDoc {
  name: string;
  short: string;
  founded: string;
  location: string;
  emails: string[];
  social: { facebook: string; twitter: string; linkedin: string; youtube: string };
}

interface StoryDoc {
  eyebrow: string;
  title: string;
  body: string;
  attribution: string;
  image?: string;
}

export const SettingsEditor = () => {
  const qc = useQueryClient();
  const [org, setOrg] = useState<OrgDoc>(ORG as OrgDoc);
  const [about, setAbout] = useState<{ body: string }>({ body: OUR_STORY });
  const [story, setStory] = useState<StoryDoc>(STORY as StoryDoc);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!db) return;
    (async () => {
      try {
        const [orgSnap, aboutSnap, storySnap] = await Promise.all([
          getDoc(doc(db!, 'content/org')),
          getDoc(doc(db!, 'content/about')),
          getDoc(doc(db!, 'content/story')),
        ]);
        if (orgSnap.exists()) setOrg((o) => ({ ...o, ...(orgSnap.data() as Partial<OrgDoc>) }));
        if (aboutSnap.exists()) setAbout((a) => ({ ...a, ...(aboutSnap.data() as { body: string }) }));
        if (storySnap.exists()) setStory((s) => ({ ...s, ...(storySnap.data() as Partial<StoryDoc>) }));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    setSaving(true);
    setSaved(false);
    setErr(null);
    try {
      const filteredEmails = org.emails.filter((e) => e.trim());
      await Promise.all([
        setDoc(doc(db, 'content/org'), { ...org, emails: filteredEmails, updatedAt: serverTimestamp() }, { merge: true }),
        setDoc(doc(db, 'content/about'), { ...about, updatedAt: serverTimestamp() }, { merge: true }),
        setDoc(doc(db, 'content/story'), { ...story, updatedAt: serverTimestamp() }, { merge: true }),
      ]);
      await qc.invalidateQueries();
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
        <h1>Site Settings</h1>
        <p>Organization info, contact emails, social links, story content.</p>
      </Header>

      {loading && <p>Loading…</p>}
      {!loading && (
        <form onSubmit={handle}>
          <Card>
            <h2>Organization</h2>
            <div className="grid">
              <div className="pair">
                <div>
                  <label>Full name</label>
                  <input value={org.name} onChange={(e) => setOrg({ ...org, name: e.target.value })} />
                </div>
                <div>
                  <label>Short name</label>
                  <input value={org.short} onChange={(e) => setOrg({ ...org, short: e.target.value })} />
                </div>
              </div>
              <div className="pair">
                <div>
                  <label>Founded</label>
                  <input value={org.founded} onChange={(e) => setOrg({ ...org, founded: e.target.value })} />
                </div>
                <div>
                  <label>Location</label>
                  <input value={org.location} onChange={(e) => setOrg({ ...org, location: e.target.value })} />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h2>Contact Emails (one per line)</h2>
            <textarea
              value={org.emails.join('\n')}
              onChange={(e) =>
                setOrg({
                  ...org,
                  emails: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                })
              }
            />
          </Card>

          <Card>
            <h2>Social Links</h2>
            <div className="grid">
              <div className="pair">
                <div>
                  <label>Facebook</label>
                  <input value={org.social.facebook} onChange={(e) => setOrg({ ...org, social: { ...org.social, facebook: e.target.value } })} />
                </div>
                <div>
                  <label>X / Twitter</label>
                  <input value={org.social.twitter} onChange={(e) => setOrg({ ...org, social: { ...org.social, twitter: e.target.value } })} />
                </div>
              </div>
              <div className="pair">
                <div>
                  <label>LinkedIn</label>
                  <input value={org.social.linkedin} onChange={(e) => setOrg({ ...org, social: { ...org.social, linkedin: e.target.value } })} />
                </div>
                <div>
                  <label>YouTube</label>
                  <input value={org.social.youtube} onChange={(e) => setOrg({ ...org, social: { ...org.social, youtube: e.target.value } })} />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h2>About Page Story</h2>
            <textarea
              value={about.body}
              onChange={(e) => setAbout({ body: e.target.value })}
            />
          </Card>

          <Card>
            <h2>Featured Impact Story (homepage)</h2>
            <div className="grid">
              <div className="pair">
                <div>
                  <label>Eyebrow</label>
                  <input value={story.eyebrow} onChange={(e) => setStory({ ...story, eyebrow: e.target.value })} />
                </div>
                <div>
                  <label>Attribution</label>
                  <input value={story.attribution} onChange={(e) => setStory({ ...story, attribution: e.target.value })} />
                </div>
              </div>
              <div>
                <label>Title</label>
                <input value={story.title} onChange={(e) => setStory({ ...story, title: e.target.value })} />
              </div>
              <div>
                <label>Body</label>
                <textarea value={story.body} onChange={(e) => setStory({ ...story, body: e.target.value })} />
              </div>
              <div>
                <label>Image URL</label>
                <input value={story.image ?? ''} onChange={(e) => setStory({ ...story, image: e.target.value })} />
              </div>
            </div>
          </Card>

          <Bar>
            <button type="submit" disabled={saving}>
              <Save size={15} /> {saving ? 'Saving…' : 'Save all settings'}
            </button>
            {saved && <span className="ok"><CheckCircle2 size={16} /> Saved</span>}
            {err && <span className="err"><AlertCircle size={16} /> {err}</span>}
          </Bar>
        </form>
      )}
    </>
  );
};
