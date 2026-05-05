import styled from '@emotion/styled';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { CheckCircle2, Heart, Users, Briefcase } from 'lucide-react';
import { PageHero } from '../components/sections/PageHero';
import { Button } from '../components/ui/Button';

const Section = styled.section`
  padding: 5rem 0;
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const Ways = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 4rem;

  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const Way = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 18px;
  border-top: 4px solid var(--color-secondary-500);
  box-shadow: var(--shadow-md);

  .icon {
    width: 52px;
    height: 52px;
    border-radius: 12px;
    background: var(--color-secondary-50);
    color: var(--color-secondary-700);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.25rem;
  }
  h3 { color: var(--color-primary-900); margin-bottom: 0.5rem; }
  p { color: var(--color-neutral-600); margin-bottom: 1rem; font-size: 0.95rem; }
`;

const FormWrap = styled.div`
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 4rem;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }

  .info {
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
    p { color: var(--color-neutral-600); font-size: 1.025rem; line-height: 1.7; }

    ul {
      list-style: none;
      padding: 0;
      margin-top: 1.5rem;
      display: grid;
      gap: 0.75rem;

      li {
        display: flex;
        align-items: start;
        gap: 0.5rem;
        color: var(--color-neutral-700);
        font-size: 0.95rem;

        svg { color: var(--color-success); flex-shrink: 0; margin-top: 4px; }
      }
    }
  }

  form {
    background: white;
    padding: 2.25rem;
    border-radius: 20px;
    box-shadow: var(--shadow-md);

    h3 { color: var(--color-primary-900); margin-bottom: 1.5rem; }

    .row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1rem;

      @media (max-width: 600px) { grid-template-columns: 1fr; }
    }

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
      input, select, textarea {
        padding: 0.75rem 0.9rem;
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
      textarea { resize: vertical; min-height: 110px; }
      .err { color: var(--color-error); font-size: 0.8rem; }
    }
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
  firstName: string;
  lastName: string;
  email: string;
  graduationYear: string;
  chapter: string;
  interest: string;
  message: string;
}

export const GetInvolvedPage = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const [submitted, setSubmitted] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const onSubmit = (data: FormData) => {
    console.log('Application:', data);
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <>
      <PageHero
        eyebrow="Get Involved"
        title="Be Part of the AYAA Movement"
        subtitle="Whether you're an alumni, a parent, or a friend of the school — there's a meaningful way to contribute."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Get Involved' }]}
      />

      <Section>
        <Container>
          <Ways ref={ref}>
            {[
              { icon: Users, title: 'Become an Alumni Member', body: 'Join our network, get updates, and connect with chapters worldwide.', cta: 'Join Now' },
              { icon: Heart, title: 'Volunteer Your Skills', body: 'Mentor students, support events, or contribute professional expertise.', cta: 'Volunteer' },
              { icon: Briefcase, title: 'Partner With AYAA', body: 'Organizations and businesses can partner with us for collaborative impact.', cta: 'Partner' },
            ].map((w, i) => {
              const Icon = w.icon;
              return (
                <Way
                  key={w.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <span className="icon"><Icon size={24} /></span>
                  <h3>{w.title}</h3>
                  <p>{w.body}</p>
                  <Button variant="secondary" size="sm">{w.cta}</Button>
                </Way>
              );
            })}
          </Ways>

          <FormWrap>
            <div className="info">
              <span className="eyebrow">Membership Application</span>
              <h2>Join the Network in Minutes</h2>
              <p>Fill out the form to register as an AYAA member. We'll connect you with the chapter closest to you and keep you in the loop on projects and events.</p>
              <ul>
                <li><CheckCircle2 size={16} /> Free to join — no membership fee</li>
                <li><CheckCircle2 size={16} /> Connect with alumni in 3 global chapters</li>
                <li><CheckCircle2 size={16} /> Get exclusive updates on school progress</li>
                <li><CheckCircle2 size={16} /> Invitations to reunions and fundraisers</li>
              </ul>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <h3>Apply for Membership</h3>
              {submitted && (
                <Success initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
                  <CheckCircle2 size={20} /> Thanks! We'll be in touch shortly.
                </Success>
              )}
              <div className="row">
                <div className="field">
                  <label>First Name</label>
                  <input {...register('firstName', { required: 'Required' })} />
                  {errors.firstName && <span className="err">{errors.firstName.message}</span>}
                </div>
                <div className="field">
                  <label>Last Name</label>
                  <input {...register('lastName', { required: 'Required' })} />
                  {errors.lastName && <span className="err">{errors.lastName.message}</span>}
                </div>
              </div>
              <div className="field">
                <label>Email Address</label>
                <input type="email" {...register('email', { required: 'Required' })} />
                {errors.email && <span className="err">{errors.email.message}</span>}
              </div>
              <div className="row">
                <div className="field">
                  <label>Graduation Year</label>
                  <input type="number" placeholder="e.g. 2010" {...register('graduationYear')} />
                </div>
                <div className="field">
                  <label>Preferred Chapter</label>
                  <select {...register('chapter')}>
                    <option value="">Select chapter</option>
                    <option>United States</option>
                    <option>Mekelle, Tigray</option>
                    <option>Addis Ababa</option>
                    <option>Other / Online</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label>How would you like to contribute?</label>
                <select {...register('interest')}>
                  <option value="">Select interest</option>
                  <option>Mentorship</option>
                  <option>Fundraising</option>
                  <option>Events & Reunions</option>
                  <option>Communications</option>
                  <option>Project Volunteering</option>
                </select>
              </div>
              <div className="field">
                <label>Message (optional)</label>
                <textarea {...register('message')} placeholder="Tell us a bit about yourself and how you'd like to help…" />
              </div>
              <Button variant="primary" fullWidth>Submit Application</Button>
            </form>
          </FormWrap>
        </Container>
      </Section>
    </>
  );
};
