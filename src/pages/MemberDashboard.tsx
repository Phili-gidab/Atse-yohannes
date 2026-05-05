import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Link, useNavigate } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, query, setDoc, where, serverTimestamp } from 'firebase/firestore';
import {
  ClipboardCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Save,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../config/firebase';
import { PageHero } from '../components/sections/PageHero';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

const Section = styled.section`
  padding: 4rem 0 6rem;
  background: var(--color-neutral-50);
`;

const Container = styled.div`
  max-width: 760px;
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const TopCard = styled.div`
  background: linear-gradient(135deg, var(--color-primary-900), var(--color-primary-800));
  color: white;
  padding: 2rem;
  border-radius: 18px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;

  .avatar {
    width: 56px; height: 56px; border-radius: 14px;
    background: linear-gradient(135deg, var(--color-accent-300), var(--color-accent-500));
    color: var(--color-primary-950);
    display: grid; place-items: center;
    font-family: var(--font-heading); font-weight: 800; font-size: 1.5rem;
  }
  h1 { color: white; margin-bottom: 0.2rem; font-size: 1.4rem; }
  .role {
    color: var(--color-accent-300);
    font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.6px; font-weight: 700;
  }
`;

const Card = styled.div`
  background: white;
  padding: 1.75rem;
  border-radius: 16px;
  border: 1px solid var(--color-neutral-200);
  margin-bottom: 1.25rem;

  h2 { color: var(--color-primary-900); font-size: 1.05rem; margin-bottom: 0.5rem; }
  p { color: var(--color-neutral-600); font-size: 0.92rem; margin-bottom: 0.75rem; }
  form { display: grid; gap: 0.75rem; margin-top: 0.75rem; }
  label { font-size: 0.82rem; font-weight: 600; color: var(--color-neutral-700); }
  input, textarea {
    width: 100%; padding: 0.6rem 0.8rem;
    border: 1px solid var(--color-neutral-300);
    border-radius: 9px; font-size: 0.92rem;
  }
  .pair { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; @media (max-width: 600px) { grid-template-columns: 1fr; } }

  button {
    background: linear-gradient(135deg, var(--color-secondary-500), var(--color-secondary-700));
    color: white;
    border: none; padding: 0.65rem 1rem;
    border-radius: 9px; font-weight: 700;
    cursor: pointer; display: inline-flex; align-items: center; gap: 0.4rem;
    width: fit-content;
    &:disabled { opacity: 0.6; cursor: not-allowed; }
  }
  .pill {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.3rem 0.7rem; border-radius: 999px;
    font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
  }
  .pill.pending { background: #fef3c7; color: #92400e; }
  .pill.approved { background: #dcfce7; color: #166534; }
  .pill.rejected { background: #fee2e2; color: #991b1b; }
  .pill.none     { background: var(--color-neutral-100); color: var(--color-neutral-600); }
`;

const QuickGrid = styled.div`
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const QuickLink = styled(Link)`
  background: white; padding: 1.25rem;
  border-radius: 14px; border: 1px solid var(--color-neutral-200);
  text-decoration: none; color: inherit;
  display: flex; align-items: center; gap: 0.85rem;
  transition: all 0.2s ease;
  .ic {
    width: 40px; height: 40px; border-radius: 10px;
    background: var(--color-secondary-50); color: var(--color-secondary-700);
    display: grid; place-items: center;
  }
  .t { font-weight: 700; color: var(--color-primary-900); margin-bottom: 0.15rem; }
  .s { color: var(--color-neutral-500); font-size: 0.85rem; }
  &:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); border-color: var(--color-secondary-300); }
`;

interface MemberProfile {
  fullName: string;
  graduationYear: string;
  currentLocation: string;
  occupation: string;
  phone: string;
  bio: string;
  publicInDirectory: boolean;
}

const DashboardInner = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [appStatus, setAppStatus] = useState<null | 'pending' | 'approved' | 'rejected'>(null);
  const [profile, setProfile] = useState<MemberProfile>({
    fullName: user?.displayName ?? '',
    graduationYear: '',
    currentLocation: '',
    occupation: '',
    phone: '',
    bio: '',
    publicInDirectory: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!db || !user) return;
    (async () => {
      try {
        // Application status
        const appRef = collection(db!, 'membershipApplications');
        const q = query(appRef, where('userId', '==', user.uid));
        const snap = await getDocs(q);
        if (!snap.empty) setAppStatus(snap.docs[0].data().status);

        // Member profile
        const memSnap = await getDoc(doc(db!, 'members', user.uid));
        if (memSnap.exists()) {
          const d = memSnap.data() as Partial<MemberProfile>;
          setProfile((p) => ({ ...p, ...d }));
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const set = <K extends keyof MemberProfile>(k: K, v: MemberProfile[K]) =>
    setProfile((p) => ({ ...p, [k]: v }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !user) return;
    setSaving(true);
    setSaved(false);
    try {
      await setDoc(
        doc(db, 'members', user.uid),
        {
          ...profile,
          email: user.email,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const initials = (user?.displayName ?? user?.email ?? 'M')
    .split(/[\s@]/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <Section>
      <Container>
        <TopCard>
          <div className="avatar">{initials}</div>
          <div style={{ flex: 1 }}>
            <h1>{user?.displayName ?? user?.email}</h1>
            <div className="role">{user?.role}</div>
          </div>
          <button
            onClick={async () => { await signOut(); navigate('/'); }}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white', padding: '0.55rem 0.85rem',
              borderRadius: 9, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.85rem'
            }}
          >
            <LogOut size={14} /> Sign out
          </button>
        </TopCard>

        <Card>
          <h2>Membership status</h2>
          {loading && <p>Loading…</p>}
          {!loading && (
            <>
              {appStatus === 'pending' && (
                <>
                  <p>Your application is being reviewed by AYAA admins.</p>
                  <span className="pill pending"><AlertCircle size={12} /> Pending review</span>
                </>
              )}
              {appStatus === 'approved' && (
                <>
                  <p>You're a confirmed AYAA member. Welcome!</p>
                  <span className="pill approved"><CheckCircle2 size={12} /> Approved</span>
                </>
              )}
              {appStatus === 'rejected' && (
                <>
                  <p>Your application wasn't approved. Reach out to admins for next steps.</p>
                  <span className="pill rejected">Rejected</span>
                </>
              )}
              {appStatus === null && (
                <>
                  <p>You haven't submitted a membership application yet.</p>
                  <span className="pill none">No application</span>
                  <div style={{ marginTop: '1rem' }}>
                    <Link
                      to="/portal/apply"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        background: 'var(--color-secondary-500)', color: 'white',
                        padding: '0.55rem 0.85rem', borderRadius: 9,
                        textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem'
                      }}
                    >
                      <ClipboardCheck size={14} /> Apply now <ArrowRight size={14} />
                    </Link>
                  </div>
                </>
              )}
            </>
          )}
        </Card>

        <QuickGrid>
          <QuickLink to="/resources">
            <span className="ic"><BookOpen size={18} /></span>
            <div>
              <div className="t">Resources</div>
              <div className="s">Books, scholarships, links</div>
            </div>
          </QuickLink>
          <QuickLink to="/events">
            <span className="ic"><ClipboardCheck size={18} /></span>
            <div>
              <div className="t">Events</div>
              <div className="s">Upcoming reunions</div>
            </div>
          </QuickLink>
        </QuickGrid>

        <Card>
          <h2>Your profile</h2>
          <p>This information is shown in the member directory if you opt in.</p>
          <form onSubmit={handleSave}>
            <div className="pair">
              <div>
                <label>Full name</label>
                <input value={profile.fullName} onChange={(e) => set('fullName', e.target.value)} />
              </div>
              <div>
                <label>Graduation year</label>
                <input value={profile.graduationYear} onChange={(e) => set('graduationYear', e.target.value)} />
              </div>
            </div>
            <div className="pair">
              <div>
                <label>Current location</label>
                <input value={profile.currentLocation} onChange={(e) => set('currentLocation', e.target.value)} />
              </div>
              <div>
                <label>Phone</label>
                <input value={profile.phone} onChange={(e) => set('phone', e.target.value)} />
              </div>
            </div>
            <div>
              <label>Occupation</label>
              <input value={profile.occupation} onChange={(e) => set('occupation', e.target.value)} />
            </div>
            <div>
              <label>Short bio</label>
              <textarea value={profile.bio} onChange={(e) => set('bio', e.target.value)} />
            </div>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={profile.publicInDirectory}
                onChange={(e) => set('publicInDirectory', e.target.checked)}
              />
              <span>Show me in the public alumni directory</span>
            </label>
            <button type="submit" disabled={saving}>
              <Save size={14} /> {saving ? 'Saving…' : 'Save profile'}
            </button>
            {saved && (
              <span style={{ color: 'var(--color-success)', display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                <CheckCircle2 size={14} /> Saved
              </span>
            )}
          </form>
        </Card>
      </Container>
    </Section>
  );
};

export const MemberDashboard = () => (
  <>
    <PageHero
      eyebrow="Member Portal"
      title="Your AYAA Dashboard"
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Portal' }]}
    />
    <ProtectedRoute redirectTo="/portal/login">
      <DashboardInner />
    </ProtectedRoute>
  </>
);
