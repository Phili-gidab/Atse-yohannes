import { useState } from 'react';
import styled from '@emotion/styled';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { db } from '../config/firebase';

const Wrap = styled.form`
  display: flex;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 12px;
  padding: 0.4rem;
  max-width: 380px;

  input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: white;
    padding: 0.55rem 0.75rem;
    font-size: 0.92rem;
    &::placeholder { color: rgba(255,255,255,0.55); }
  }
  button {
    background: linear-gradient(135deg, var(--color-accent-400), var(--color-accent-600));
    color: var(--color-primary-950);
    border: none;
    padding: 0.55rem 1rem;
    border-radius: 8px;
    font-weight: 700;
    font-size: 0.86rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    &:hover:not(:disabled) { transform: translateY(-1px); }
    &:disabled { opacity: 0.6; cursor: not-allowed; }
  }
`;

const Note = styled.div<{ $kind: 'ok' | 'err' }>`
  margin-top: 0.5rem;
  font-size: 0.82rem;
  color: ${({ $kind }) => ($kind === 'ok' ? '#86efac' : '#fca5a5')};
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
`;

export const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) { setErr('Backend not configured'); return; }
    setBusy(true);
    setErr(null);
    try {
      await addDoc(collection(db, 'newsletterSubscriptions'), {
        email,
        submittedAt: serverTimestamp(),
      });
      setOk(true);
      setEmail('');
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Wrap onSubmit={handle}>
        <input
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" disabled={busy}>
          <Mail size={14} /> {busy ? 'Subscribing…' : 'Subscribe'}
        </button>
      </Wrap>
      {ok && (
        <Note $kind="ok">
          <CheckCircle2 size={14} /> You're subscribed.
        </Note>
      )}
      {err && (
        <Note $kind="err">
          <AlertCircle size={14} /> {err}
        </Note>
      )}
    </>
  );
};
