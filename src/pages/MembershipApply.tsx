import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { ClipboardCheck, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../config/firebase';
import { PageHero } from '../components/sections/PageHero';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

const Section = styled.section`
  padding: 4rem 0 6rem;
  background: var(--color-neutral-50);
`;

const Container = styled.div`
  max-width: 640px;
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const Card = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 18px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-neutral-200);

  .icon {
    width: 52px; height: 52px; border-radius: 14px;
    background: linear-gradient(135deg, var(--color-secondary-400), var(--color-secondary-600));
    color: white;
    display: grid; place-items: center;
    margin-bottom: 1.25rem;
  }
  h1 { color: var(--color-primary-900); margin-bottom: 0.4rem; font-size: 1.6rem; }
  p { color: var(--color-neutral-600); margin-bottom: 1.5rem; font-size: 0.95rem; }

  form { display: grid; gap: 0.85rem; }
  label { font-size: 0.85rem; font-weight: 600; color: var(--color-neutral-700); }
  input, textarea, select {
    width: 100%;
    padding: 0.7rem 0.85rem;
    border: 1px solid var(--color-neutral-300);
    border-radius: 10px;
    font-size: 0.95rem;
    font-family: inherit;
    &:focus { outline: none; border-color: var(--color-secondary-500); box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.18); }
  }
  textarea { min-height: 100px; resize: vertical; }
  .pair { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; @media (max-width: 600px) { grid-template-columns: 1fr; } }
  button[type="submit"] {
    margin-top: 0.5rem;
    background: linear-gradient(135deg, var(--color-secondary-500), var(--color-secondary-700));
    color: white;
    border: none;
    padding: 0.85rem 1rem;
    border-radius: 10px;
    font-weight: 700;
    cursor: pointer;
    display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
    &:hover:not(:disabled) { transform: translateY(-2px); }
    &:disabled { opacity: 0.6; cursor: not-allowed; }
  }
  .err { background: #fee2e2; color: #991b1b; padding: 0.7rem 0.85rem; border-radius: 10px; font-size: 0.88rem; display: flex; align-items: center; gap: 0.5rem; }
  .ok { background: #dcfce7; color: #166534; padding: 0.7rem 0.85rem; border-radius: 10px; font-size: 0.88rem; display: flex; align-items: center; gap: 0.5rem; }
  .pending {
    background: #fef3c7; color: #92400e; padding: 1rem;
    border-radius: 10px; font-size: 0.92rem;
    display: flex; align-items: start; gap: 0.6rem;
  }
`;

interface FormData {
  fullName: string;
  graduationYear: string;
  currentLocation: string;
  occupation: string;
  phone: string;
  notes: string;
  chapter: string;
}

const ApplyInner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<FormData>({
    fullName: user?.displayName ?? '',
    graduationYear: '',
    currentLocation: '',
    occupation: '',
    phone: '',
    notes: '',
    chapter: 'United States',
  });
  const [existing, setExisting] = useState<null | 'pending' | 'approved' | 'rejected'>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (!db || !user) return;
    (async () => {
      try {
        const ref = collection(db!, 'membershipApplications');
        const q = query(ref, where('userId', '==', user.uid));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const status = snap.docs[0].data().status as 'pending' | 'approved' | 'rejected';
          setExisting(status);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const set = <K extends keyof FormData>(k: K, v: FormData[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !user) return;
    setBusy(true);
    setErr(null);
    try {
      await addDoc(collection(db, 'membershipApplications'), {
        userId: user.uid,
        email: user.email,
        ...data,
        status: 'pending',
        submittedAt: serverTimestamp(),
      });
      setOk(true);
      setExisting('pending');
      setTimeout(() => navigate('/portal'), 1500);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <Section><Container><Card><p>Loading…</p></Card></Container></Section>
    );
  }

  if (existing === 'pending') {
    return (
      <Section>
        <Container>
          <Card>
            <span className="icon"><ClipboardCheck size={22} /></span>
            <h1>Application Submitted</h1>
            <div className="pending">
              <AlertCircle size={20} />
              <div>
                Your application is <strong>pending review</strong>. An AYAA admin will review and approve
                it. You'll see member-only content unlocked once approved.
              </div>
            </div>
          </Card>
        </Container>
      </Section>
    );
  }

  if (existing === 'approved') {
    return (
      <Section>
        <Container>
          <Card>
            <span className="icon"><CheckCircle2 size={22} /></span>
            <h1>You're already a member</h1>
            <p>Your membership has been approved. Visit the dashboard to manage your profile.</p>
            <button type="button" onClick={() => navigate('/portal')}>Go to dashboard</button>
          </Card>
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container>
        <Card>
          <span className="icon"><ClipboardCheck size={22} /></span>
          <h1>Membership Application</h1>
          <p>Tell us about yourself. AYAA admins will review and approve your application.</p>

          {ok ? (
            <div className="ok"><CheckCircle2 size={18} /> Submitted! Redirecting…</div>
          ) : (
            <form onSubmit={handle}>
              <div>
                <label>Full name</label>
                <input value={data.fullName} onChange={(e) => set('fullName', e.target.value)} required />
              </div>
              <div className="pair">
                <div>
                  <label>Graduation year</label>
                  <input value={data.graduationYear} onChange={(e) => set('graduationYear', e.target.value)} placeholder="2008" required />
                </div>
                <div>
                  <label>Phone</label>
                  <input value={data.phone} onChange={(e) => set('phone', e.target.value)} />
                </div>
              </div>
              <div className="pair">
                <div>
                  <label>Current location</label>
                  <input value={data.currentLocation} onChange={(e) => set('currentLocation', e.target.value)} placeholder="Dallas, TX" required />
                </div>
                <div>
                  <label>Chapter you'll join</label>
                  <select value={data.chapter} onChange={(e) => set('chapter', e.target.value)}>
                    <option>United States</option>
                    <option>Mekelle, Tigray</option>
                    <option>Addis Ababa</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label>Occupation / professional background</label>
                <input value={data.occupation} onChange={(e) => set('occupation', e.target.value)} placeholder="Software engineer" />
              </div>
              <div>
                <label>Anything else you'd like to share? (optional)</label>
                <textarea value={data.notes} onChange={(e) => set('notes', e.target.value)} />
              </div>
              {err && <div className="err"><AlertCircle size={16} /> {err}</div>}
              <button type="submit" disabled={busy}>
                {busy ? 'Submitting…' : <>Submit application <ArrowRight size={16} /></>}
              </button>
            </form>
          )}
        </Card>
      </Container>
    </Section>
  );
};

export const MembershipApply = () => (
  <>
    <PageHero
      eyebrow="Become a Member"
      title="Apply for AYAA Membership"
      subtitle="Join a global network of alumni supporting Atse Yohannes School."
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Apply' }]}
    />
    <ProtectedRoute redirectTo="/portal/login">
      <ApplyInner />
    </ProtectedRoute>
  </>
);
