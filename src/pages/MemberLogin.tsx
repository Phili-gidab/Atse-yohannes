import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { PageHero } from '../components/sections/PageHero';

const Section = styled.section`
  padding: 4rem 0 6rem;
  background: var(--color-neutral-50);
`;

const Container = styled.div`
  max-width: 440px;
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
  h1 { color: var(--color-primary-900); margin-bottom: 0.4rem; font-size: 1.55rem; }
  p { color: var(--color-neutral-600); margin-bottom: 1.5rem; font-size: 0.95rem; }

  form { display: grid; gap: 0.85rem; }
  label { font-size: 0.85rem; font-weight: 600; color: var(--color-neutral-700); }
  input {
    width: 100%;
    padding: 0.7rem 0.85rem;
    border: 1px solid var(--color-neutral-300);
    border-radius: 10px;
    font-size: 0.95rem;
    &:focus { outline: none; border-color: var(--color-secondary-500); box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.18); }
  }
  button[type="submit"] {
    margin-top: 0.5rem;
    background: linear-gradient(135deg, var(--color-primary-800), var(--color-primary-950));
    color: white;
    border: none;
    padding: 0.85rem 1rem;
    border-radius: 10px;
    font-weight: 700;
    font-size: 0.95rem;
    cursor: pointer;
    display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
    &:hover:not(:disabled) { transform: translateY(-2px); }
    &:disabled { opacity: 0.6; cursor: not-allowed; }
  }
  .err { background: #fee2e2; color: #991b1b; padding: 0.7rem 0.85rem; border-radius: 10px; font-size: 0.88rem; }
  .alt { margin-top: 1rem; font-size: 0.88rem; color: var(--color-neutral-600); a { color: var(--color-secondary-700); font-weight: 600; } }
`;

export const MemberLogin = () => {
  const { user, signIn, configured } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (user) navigate('/portal');
  }, [user, navigate]);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      await signIn(email, password);
    } catch (e) {
      setErr((e as Error).message);
      setBusy(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Member Portal"
        title="Sign In"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Sign in' }]}
      />
      <Section>
        <Container>
          <Card>
            <span className="icon"><LogIn size={22} /></span>
            <h1>Welcome back</h1>
            <p>Sign in to access your member dashboard.</p>

            {!configured && <div className="err">Backend not configured.</div>}

            {configured && (
              <form onSubmit={handle}>
                <div>
                  <label>Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                  <label>Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                {err && <div className="err">{err}</div>}
                <button type="submit" disabled={busy}>
                  {busy ? 'Signing in…' : <>Sign in <ArrowRight size={16} /></>}
                </button>
              </form>
            )}

            <div className="alt">
              Don't have an account? <Link to="/portal/signup">Sign up</Link>
            </div>
          </Card>
        </Container>
      </Section>
    </>
  );
};
