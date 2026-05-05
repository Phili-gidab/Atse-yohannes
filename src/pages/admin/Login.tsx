import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogIn, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Wrap = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(180deg, var(--color-primary-950), var(--color-primary-800));
  padding: 2rem;
`;

const Card = styled.div`
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 18px;
  padding: 2.5rem;
  box-shadow: var(--shadow-2xl);

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
    background: linear-gradient(135deg, var(--color-primary-800), var(--color-primary-950));
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
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    &:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(0,0,0,0.25); }
    &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  }
  .err {
    background: #fee2e2;
    color: #991b1b;
    padding: 0.7rem 0.85rem;
    border-radius: 10px;
    font-size: 0.88rem;
  }
`;

export const Login = () => {
  const { user, signIn, configured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/admin';

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, from, navigate]);

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

  if (!configured) {
    return (
      <Wrap>
        <Card>
          <h1>Backend not configured</h1>
          <p>Add Firebase env vars to <code>.env.local</code> and restart the dev server.</p>
        </Card>
      </Wrap>
    );
  }

  return (
    <Wrap>
      <Card>
        <span className="icon"><LogIn size={22} /></span>
        <h1>Admin Sign In</h1>
        <p>Sign in to manage AYAA content.</p>
        <form onSubmit={handle}>
          <div>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {err && <div className="err">{err}</div>}
          <button type="submit" disabled={busy}>
            {busy ? 'Signing in…' : <>Sign in <ArrowRight size={16} /></>}
          </button>
        </form>
      </Card>
    </Wrap>
  );
};
