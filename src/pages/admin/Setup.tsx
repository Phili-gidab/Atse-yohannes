import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../config/firebase';

const Wrap = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(180deg, var(--color-primary-950), var(--color-primary-800));
  padding: 2rem;
`;

const Card = styled.div`
  width: 100%;
  max-width: 480px;
  background: white;
  border-radius: 18px;
  padding: 2.5rem;
  box-shadow: var(--shadow-2xl);

  .icon {
    width: 56px; height: 56px; border-radius: 14px;
    background: linear-gradient(135deg, var(--color-accent-300), var(--color-accent-500));
    color: var(--color-primary-950);
    display: grid; place-items: center;
    margin-bottom: 1.25rem;
  }
  h1 { color: var(--color-primary-900); margin-bottom: 0.5rem; }
  p { color: var(--color-neutral-600); margin-bottom: 1.5rem; }

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
    background: linear-gradient(135deg, var(--color-accent-400), var(--color-accent-600));
    color: var(--color-primary-950);
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
    &:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(245, 183, 29, 0.35); }
    &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
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
  }
`;

export const Setup = () => {
  const { user, signUp, signIn, configured } = useAuth();
  const navigate = useNavigate();
  const [bootstrapDone, setBootstrapDone] = useState<boolean | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Check if bootstrap has already happened.
  useEffect(() => {
    if (!db) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db!, 'system/bootstrap'));
        setBootstrapDone(snap.exists());
      } catch {
        setBootstrapDone(false);
      }
    })();
  }, []);

  const claim = async () => {
    if (!db || !user) return;
    setBusy(true);
    setErr(null);
    try {
      // Promote self to super_admin and write the bootstrap sentinel.
      // Rules: this is allowed exactly once (when /system/bootstrap doesn't exist).
      await setDoc(
        doc(db, 'users', user.uid),
        { role: 'super_admin', email: user.email, displayName: user.displayName },
        { merge: true }
      );
      await setDoc(doc(db, 'system/bootstrap'), {
        uid: user.uid,
        email: user.email,
        createdAt: serverTimestamp(),
      });
      navigate('/admin');
      // Force a token refresh so AuthProvider re-loads the new role.
      window.location.reload();
    } catch (e) {
      setErr((e as Error).message);
      setBusy(false);
    }
  };

  const handleCreateAndClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      await signUp(email, password, displayName);
      // After signup AuthProvider populates user; small delay then claim.
      setTimeout(() => void claim(), 600);
    } catch (e) {
      setErr((e as Error).message);
      setBusy(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      await signIn(email, password);
      setTimeout(() => void claim(), 600);
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

  if (bootstrapDone === null) {
    return (
      <Wrap>
        <Card>
          <p>Checking setup state…</p>
        </Card>
      </Wrap>
    );
  }

  if (bootstrapDone) {
    return (
      <Wrap>
        <Card>
          <span className="icon"><ShieldCheck size={26} /></span>
          <h1>Setup already complete</h1>
          <p>An administrator has been registered. Use the login page to sign in.</p>
          <button type="button" onClick={() => navigate('/admin/login')}>
            Go to login <ArrowRight size={16} />
          </button>
        </Card>
      </Wrap>
    );
  }

  // Bootstrap not done yet.
  if (user) {
    return (
      <Wrap>
        <Card>
          <span className="icon"><ShieldCheck size={26} /></span>
          <h1>Claim Super Admin</h1>
          <p>
            You're signed in as <strong>{user.email}</strong>. Click below to assign yourself
            the <code>super_admin</code> role. This page will lock once claimed.
          </p>
          {err && <div className="err">{err}</div>}
          <button type="button" onClick={claim} disabled={busy}>
            {busy ? 'Claiming…' : <>Become Super Admin <ArrowRight size={16} /></>}
          </button>
        </Card>
      </Wrap>
    );
  }

  // Not signed in — offer create account or sign in.
  return (
    <Wrap>
      <Card>
        <span className="icon"><ShieldCheck size={26} /></span>
        <h1>Create First Admin</h1>
        <p>
          Create the AYAA super admin account. This page locks once an admin exists.
        </p>
        <form onSubmit={handleCreateAndClaim}>
          <div>
            <label>Display name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Memhir Aebeyo"
              required
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password</label>
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
            {busy ? 'Creating…' : <>Create & claim admin <ArrowRight size={16} /></>}
          </button>
        </form>
        <p style={{ marginTop: '1.25rem', fontSize: '0.86rem' }}>
          Already have a Firebase account for this project?{' '}
          <button
            type="button"
            onClick={handleSignIn}
            style={{ background: 'none', border: 'none', color: 'var(--color-secondary-700)', cursor: 'pointer', padding: 0, fontWeight: 600 }}
          >
            Sign in instead
          </button>
        </p>
      </Card>
    </Wrap>
  );
};
