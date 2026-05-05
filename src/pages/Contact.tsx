import styled from '@emotion/styled';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { Mail, MapPin, Send, CheckCircle2, MessageCircle, AlertCircle } from 'lucide-react';
import { PageHero } from '../components/sections/PageHero';
import { Button } from '../components/ui/Button';
import { useOrg } from '../hooks/useContent';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { db } from '../config/firebase';

interface OrgShape { emails: string[]; location: string }

const Section = styled.section`
  padding: 5rem 0;
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 0.85fr 1.15fr;
  gap: 4rem;

  @media (max-width: 900px) { grid-template-columns: 1fr; gap: 2.5rem; }
`;

const Info = styled.div`
  .eyebrow {
    color: var(--color-secondary-600);
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 0.75rem;
    display: inline-block;
  }
  h2 { margin-bottom: 1rem; }
  p { color: var(--color-neutral-600); margin-bottom: 2rem; line-height: 1.7; }

  .channels {
    display: grid;
    gap: 1rem;

    .ch {
      display: flex;
      align-items: start;
      gap: 1rem;
      padding: 1.25rem;
      background: white;
      border: 1px solid var(--color-neutral-200);
      border-radius: 14px;
      transition: all 0.25s ease;

      .icon {
        width: 44px;
        height: 44px;
        border-radius: 11px;
        background: var(--color-secondary-50);
        color: var(--color-secondary-700);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .lbl {
        font-size: 0.78rem;
        text-transform: uppercase;
        letter-spacing: 0.6px;
        color: var(--color-neutral-500);
        font-weight: 700;
        margin-bottom: 0.25rem;
      }
      .val {
        color: var(--color-primary-900);
        font-weight: 600;
        font-size: 0.95rem;

        a { color: var(--color-primary-900); text-decoration: none; &:hover { color: var(--color-secondary-700); } }
        div { color: var(--color-primary-900); }
      }

      &:hover {
        border-color: var(--color-secondary-400);
        transform: translateY(-3px);
        box-shadow: var(--shadow-sm);
      }
    }
  }
`;

const FormCard = styled.form`
  background: white;
  padding: 2.5rem;
  border-radius: 22px;
  box-shadow: var(--shadow-md);

  h3 { color: var(--color-primary-900); margin-bottom: 1.5rem; }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-bottom: 1rem;

    label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--color-primary-900);
    }
    input, textarea, select {
      padding: 0.85rem 1rem;
      border: 1px solid var(--color-neutral-200);
      border-radius: 10px;
      font-size: 0.95rem;
      font-family: inherit;
      background: var(--color-neutral-50);
      transition: all 0.2s ease;
      outline: none;

      &:focus {
        border-color: var(--color-secondary-500);
        background: white;
        box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.1);
      }
    }
    textarea { resize: vertical; min-height: 140px; }
    .err { color: var(--color-error); font-size: 0.8rem; }
  }

  .row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    @media (max-width: 540px) { grid-template-columns: 1fr; }
  }
`;

const Success = styled(motion.div)`
  background: var(--color-success);
  color: white;
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  font-weight: 600;
`;

interface FormData {
  name: string;
  email: string;
  subject: string;
  type: string;
  message: string;
}

export const Contact = () => {
  useDocumentTitle('Contact', 'Get in touch with the AYAA team — for inquiries, partnerships, or support.');
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { data: orgData } = useOrg();
  const ORG: OrgShape = (orgData ?? { emails: [], location: '' }) as OrgShape;

  const onSubmit = async (data: FormData) => {
    setBusy(true);
    setErr(null);
    try {
      if (!db) throw new Error('Backend not configured');
      await addDoc(collection(db, 'contactSubmissions'), {
        ...data,
        status: 'new',
        submittedAt: serverTimestamp(),
      });
      setSent(true);
      reset();
      setTimeout(() => setSent(false), 5000);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's Connect"
        subtitle="For inquiries, partnerships, or support — reach out and a member of the AYAA team will respond shortly."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
      />

      <Section>
        <Container>
          <Grid>
            <Info>
              <span className="eyebrow">Get in Touch</span>
              <h2>We'd love to hear from you</h2>
              <p>Whether you're an alumnus, a potential donor, or a partner organization — there's a real person on the other end ready to help.</p>

              <div className="channels">
                {ORG.emails.map((email) => (
                  <div className="ch" key={email}>
                    <span className="icon"><Mail size={20} /></span>
                    <div>
                      <div className="lbl">Email</div>
                      <div className="val"><a href={`mailto:${email}`}>{email}</a></div>
                    </div>
                  </div>
                ))}

                <div className="ch">
                  <span className="icon"><MapPin size={20} /></span>
                  <div>
                    <div className="lbl">Location</div>
                    <div className="val"><div>{ORG.location}</div></div>
                  </div>
                </div>

                <div className="ch">
                  <span className="icon"><MessageCircle size={20} /></span>
                  <div>
                    <div className="lbl">Office Hours</div>
                    <div className="val"><div>Mon — Fri · 9:00 AM – 5:00 PM (EAT)</div></div>
                  </div>
                </div>
              </div>
            </Info>

            <FormCard onSubmit={handleSubmit(onSubmit)}>
              <h3>Send Us a Message</h3>
              {sent && (
                <Success initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
                  <CheckCircle2 size={20} /> Thanks for reaching out — we'll get back to you soon.
                </Success>
              )}
              <div className="row">
                <div className="field">
                  <label>Full Name</label>
                  <input {...register('name', { required: 'Required' })} />
                  {errors.name && <span className="err">{errors.name.message}</span>}
                </div>
                <div className="field">
                  <label>Email</label>
                  <input type="email" {...register('email', { required: 'Required' })} />
                  {errors.email && <span className="err">{errors.email.message}</span>}
                </div>
              </div>
              <div className="row">
                <div className="field">
                  <label>Subject</label>
                  <input {...register('subject', { required: 'Required' })} />
                  {errors.subject && <span className="err">{errors.subject.message}</span>}
                </div>
                <div className="field">
                  <label>Inquiry Type</label>
                  <select {...register('type')}>
                    <option>General</option>
                    <option>Donation</option>
                    <option>Partnership</option>
                    <option>Membership</option>
                    <option>Press / Media</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label>Message</label>
                <textarea {...register('message', { required: 'Required' })} />
                {errors.message && <span className="err">{errors.message.message}</span>}
              </div>
              {err && (
                <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.7rem 0.85rem', borderRadius: 10, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertCircle size={16} /> {err}
                </div>
              )}
              <Button variant="primary" fullWidth disabled={busy} type="submit">
                <Send size={16} /> {busy ? 'Sending…' : 'Send Message'}
              </Button>
            </FormCard>
          </Grid>
        </Container>
      </Section>
    </>
  );
};
