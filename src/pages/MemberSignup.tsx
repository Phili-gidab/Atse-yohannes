import { useState } from 'react';
import styled from '@emotion/styled';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { PageHero } from '../components/sections/PageHero';

const Section = styled.section`
  padding: 4rem 0 6rem;
  background: var(--color-neutral-50);
`;

const Container = styled.div`
  max-width: 480px;
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
  input {
    width: 100%;
    padding: 0.7rem 0.85rem;
    border: 1px solid var(--color-neutral-300);
    border-radius: 10px;
    font-size: 0.95rem;
    &:focus {
      outline: none;
      border-color: var(--color-secondary-500);
      box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.18);
    }
  }
  button[type="submit"] {
    margin-top: 0.5rem;
    background: linear-gradient(135deg, var(--color-secondary-500), var(--color-secondary-700));
    color: white;
    border: none;
    padding: 0.85rem 1rem;
    border-radius: 10px;
    font-weight: 700;
    font-size: 0.95rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: transform 0.2s ease;
    &:hover:not(:disabled) { transform: translateY(-2px); }
    &:disabled { opacity: 0.6; cursor: not-allowed; }
  }
  .err {
    background: #fee2e2;
    color: #991b1b;
    padding: 0.7rem 0.85rem;
    border-radius: 10px;
    font-size: 0.88rem;
  }
  .ok {
    background: #dcfce7;
    color: #166534;
    padding: 0.7rem 0.85rem;
    border-radius: 10px;
    font-size: 0.88rem;
    display: flex; align-items: center; gap: 0.5rem;
  }
  .alt {
    margin-top: 1rem;
    font-size: 0.88rem;
    color: var(--color-neutral-600);
    a { color: var(--color-secondary-700); font-weight: 600; }
  }
`;

export const MemberSignup = () => {
  const { signUp, configured } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      await signUp(email, password, name);
      setOk(true);
      setTimeout(() => navigate('/portal/apply'), 1200);
    } catch (e) {
      setErr((e as Error).message);
      setBusy(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Join AYAA"
        title="Create Your Member Account"
        subtitle="Sign up to apply for AYAA membership, RSVP to events, and access member-only resources."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Sign up' }]}
      />
      <Section>
        <Container>
          <Card>
            <span className="icon"><UserPlus size={22} /></span>
            <h1>Create account</h1>
            <p>Step 1 of 2 — create your account, then submit your membership application.</p>

            {!configured && (
              <div className="err">Backend not configured. Add Firebase env vars and restart.</div>
            )}

            {ok && (
              <div className="ok"><CheckCircle2 size={18} /> Account created. Redirecting…</div>
            )}

            {!ok && configured && (
              <form onSubmit={handle}>
                <div>
                  <label>Full name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                  <label>Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                  <label>Password (8+ characters)</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    required
                  />
                </div>
                {err && <div className="err">{err}</div>}
                <button type="submit" disabled={busy}>
                  {busy ? 'Creating…' : <>Create account <ArrowRight size={16} /></>}
                </button>
              </form>
            )}

            <div className="alt">
              Already have an account? <Link to="/portal/login">Sign in</Link>
            </div>
          </Card>
        </Container>
      </Section>
    </>
  );
};
