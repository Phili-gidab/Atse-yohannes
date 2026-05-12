import { useState } from 'react';
import styled from '@emotion/styled';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { CheckCircle2, X, AlertCircle } from 'lucide-react';
import { db } from '../../config/firebase';

interface Props {
  eventSlug: string;
  eventTitle: string;
  onClose: () => void;
}

const Backdrop = styled.div`
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(30, 58, 138, 0.6);
  backdrop-filter: blur(6px);
  display: grid; place-items: center;
  padding: 1rem;
  animation: fade 0.2s ease;
  @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
`;

const Modal = styled.div`
  background: white;
  border-radius: 18px;
  padding: 2rem;
  max-width: 480px;
  width: 100%;
  position: relative;
  box-shadow: 0 30px 60px rgba(0,0,0,0.3);

  .close {
    position: absolute; top: 14px; right: 14px;
    background: var(--color-neutral-100); border: none;
    width: 32px; height: 32px; border-radius: 50%;
    display: grid; place-items: center; cursor: pointer;
    color: var(--color-neutral-600);
    &:hover { background: var(--color-neutral-200); }
  }
  h2 { color: var(--color-primary-900); margin-bottom: 0.4rem; font-size: 1.3rem; }
  .sub { color: var(--color-neutral-600); font-size: 0.92rem; margin-bottom: 1.25rem; }

  form { display: grid; gap: 0.75rem; }
  label { font-size: 0.82rem; font-weight: 600; color: var(--color-neutral-700); }
  input, select {
    width: 100%; padding: 0.65rem 0.8rem;
    border: 1px solid var(--color-neutral-300);
    border-radius: 9px; font-size: 0.92rem;
    &:focus { outline: none; border-color: var(--color-secondary-500); box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.18); }
  }
  .pair { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; @media (max-width: 480px) { grid-template-columns: 1fr; } }
  button[type="submit"] {
    margin-top: 0.5rem;
    background: linear-gradient(135deg, var(--color-secondary-500), var(--color-secondary-700));
    color: white; border: none;
    padding: 0.75rem 1rem; border-radius: 10px;
    font-weight: 700; cursor: pointer;
    display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
    &:disabled { opacity: 0.6; cursor: not-allowed; }
  }
  .err { background: #fee2e2; color: #991b1b; padding: 0.6rem 0.8rem; border-radius: 9px; font-size: 0.85rem; display: flex; align-items: center; gap: 0.4rem; }
  .ok { background: #dcfce7; color: #166534; padding: 0.85rem; border-radius: 10px; display: flex; align-items: center; gap: 0.5rem; font-weight: 600; }
`;

export const RsvpModal = ({ eventSlug, eventTitle, onClose }: Props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [guests, setGuests] = useState(1);
  const [phone, setPhone] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    setBusy(true);
    setErr(null);
    try {
      await addDoc(collection(db, 'events', eventSlug, 'rsvps'), {
        name,
        email,
        guests,
        phone,
        eventTitle,
        submittedAt: serverTimestamp(),
      });
      setOk(true);
      setTimeout(onClose, 1800);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Backdrop onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose} aria-label="Close"><X size={16} /></button>
        <h2>RSVP {'—'} {eventTitle}</h2>
        <div className="sub">Reserve your spot. We'll email a reminder closer to the date.</div>

        {ok ? (
          <div className="ok"><CheckCircle2 size={20} /> RSVP confirmed. See you there!</div>
        ) : (
          <form onSubmit={handle}>
            <div>
              <label>Full name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="pair">
              <div>
                <label>Number of guests</label>
                <input type="number" min={1} max={10} value={guests} onChange={(e) => setGuests(Number(e.target.value))} required />
              </div>
              <div>
                <label>Phone (optional)</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>
            {err && <div className="err"><AlertCircle size={16} /> {err}</div>}
            <button type="submit" disabled={busy}>
              {busy ? `Submitting${'…'}` : 'Confirm RSVP'}
            </button>
          </form>
        )}
      </Modal>
    </Backdrop>
  );
};
