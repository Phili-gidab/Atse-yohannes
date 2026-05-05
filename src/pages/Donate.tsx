import { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { CheckCircle2, CreditCard, Lock, Shield, Heart } from 'lucide-react';
import { PageHero } from '../components/sections/PageHero';
import { Button } from '../components/ui/Button';
import { DONATION_TIERS } from '../data/content';

const Section = styled.section`
  padding: 5rem 0;
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 4rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const TiersList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 540px) { grid-template-columns: 1fr; }
`;

const Tier = styled(motion.button)<{ $selected: boolean; $featured?: boolean }>`
  position: relative;
  padding: 1.5rem;
  background: white;
  border: 2px solid ${({ $selected }) => ($selected ? 'var(--color-secondary-500)' : 'var(--color-neutral-200)')};
  border-radius: 16px;
  cursor: pointer;
  text-align: left;
  transition: all 0.25s ease;
  font-family: inherit;

  ${({ $featured }) =>
    $featured &&
    `
    &::before {
      content: 'Most Popular';
      position: absolute;
      top: -10px;
      right: 16px;
      background: var(--color-accent-500);
      color: var(--color-primary-900);
      padding: 0.2rem 0.6rem;
      border-radius: 999px;
      font-size: 0.68rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 800;
    }
    `}

  .label {
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--color-secondary-700);
    font-weight: 700;
    margin-bottom: 0.4rem;
  }
  .amount {
    font-family: var(--font-heading);
    font-weight: 800;
    font-size: 1.75rem;
    color: var(--color-primary-900);
    margin-bottom: 0.4rem;
    line-height: 1;
  }
  .impact {
    font-size: 0.85rem;
    color: var(--color-neutral-600);
    line-height: 1.45;
  }

  &:hover {
    border-color: var(--color-secondary-400);
    transform: translateY(-3px);
  }
`;

const CustomAmount = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: white;
  border: 2px solid var(--color-neutral-200);
  border-radius: 14px;
  padding: 0.6rem 1rem;
  margin-bottom: 2rem;

  &:focus-within { border-color: var(--color-secondary-500); }

  .currency {
    font-family: var(--font-heading);
    font-weight: 700;
    color: var(--color-primary-900);
    font-size: 1.2rem;
  }
  input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 1.2rem;
    font-family: var(--font-heading);
    font-weight: 700;
    color: var(--color-primary-900);
    background: transparent;
  }
  .freq {
    display: flex;
    gap: 0.25rem;
    background: var(--color-neutral-100);
    padding: 0.25rem;
    border-radius: 999px;

    button {
      padding: 0.4rem 0.85rem;
      border: none;
      background: transparent;
      font-size: 0.8rem;
      font-weight: 600;
      border-radius: 999px;
      cursor: pointer;
      color: var(--color-neutral-600);

      &.active {
        background: var(--color-primary-900);
        color: white;
      }
    }
  }
`;

const Sidebar = styled.div`
  position: sticky;
  top: 110px;
  align-self: start;

  background: linear-gradient(135deg, var(--color-primary-900), var(--color-primary-800));
  color: white;
  padding: 2.25rem;
  border-radius: 22px;

  h3 { color: white; margin-bottom: 1rem; font-size: 1.35rem; }

  .progress {
    margin-bottom: 1.5rem;

    .row {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
      margin-bottom: 0.5rem;
      color: rgba(255,255,255,0.85);
    }
    .bar {
      height: 8px;
      background: rgba(255,255,255,0.12);
      border-radius: 999px;
      overflow: hidden;
    }
    .fill {
      height: 100%;
      background: linear-gradient(90deg, var(--color-accent-400), var(--color-accent-600));
    }
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 1.5rem 0 2rem;
    display: grid;
    gap: 0.75rem;
    li {
      display: flex;
      align-items: start;
      gap: 0.5rem;
      color: rgba(255,255,255,0.85);
      font-size: 0.92rem;
      svg { color: var(--color-secondary-300); flex-shrink: 0; margin-top: 4px; }
    }
  }

  .trust {
    border-top: 1px solid rgba(255,255,255,0.1);
    padding-top: 1.25rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.82rem;
    color: rgba(255,255,255,0.7);
    svg { color: var(--color-secondary-300); }
  }
`;

const Header = styled.div`
  margin-bottom: 2rem;

  .eyebrow {
    color: var(--color-secondary-600);
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 0.6rem;
    display: inline-block;
  }
  h2 { margin-bottom: 0.6rem; }
  p { color: var(--color-neutral-600); }
`;

export const Donate = () => {
  const [selectedAmount, setSelectedAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const raised = 10100;
  const goal = 25000;
  const pct = Math.min(100, Math.round((raised / goal) * 100));

  const handleTier = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  return (
    <>
      <PageHero
        eyebrow="Donate"
        title="Your Gift Empowers a Student"
        subtitle="Every contribution directly supports students at Atse Yohannes School — improving infrastructure, providing resources, and expanding opportunities."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Donate' }]}
      />

      <Section>
        <Container>
          <Layout>
            <div ref={ref}>
              <Header>
                <span className="eyebrow">Choose Your Impact</span>
                <h2>Pick a tier or enter any amount</h2>
                <p>Every donation goes directly to school programs and infrastructure.</p>
              </Header>

              <TiersList>
                {DONATION_TIERS.map((t, i) => (
                  <Tier
                    key={t.amount}
                    $selected={selectedAmount === t.amount && !customAmount}
                    $featured={t.featured}
                    onClick={() => handleTier(t.amount)}
                    initial={{ opacity: 0, y: 16 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                  >
                    <div className="label">{t.label}</div>
                    <div className="amount">${t.amount}</div>
                    <div className="impact">{t.impact}</div>
                  </Tier>
                ))}
              </TiersList>

              <CustomAmount>
                <span className="currency">$</span>
                <input
                  type="number"
                  placeholder="Custom amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                />
                <div className="freq">
                  <button
                    className={frequency === 'one-time' ? 'active' : ''}
                    onClick={() => setFrequency('one-time')}
                  >One-time</button>
                  <button
                    className={frequency === 'monthly' ? 'active' : ''}
                    onClick={() => setFrequency('monthly')}
                  >Monthly</button>
                </div>
              </CustomAmount>

              <Button variant="gold" size="lg" fullWidth>
                <Heart size={18} /> Donate ${customAmount || selectedAmount} {frequency === 'monthly' ? '/month' : ''}
              </Button>

              <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--color-neutral-500)', textAlign: 'center' }}>
                Donations processed securely. You'll receive a tax receipt by email.
              </p>
            </div>

            <Sidebar>
              <h3>Library Media Center Campaign</h3>
              <div className="progress">
                <div className="row">
                  <span>${raised.toLocaleString()} raised</span>
                  <span>{pct}%</span>
                </div>
                <div className="bar"><div className="fill" style={{ width: `${pct}%` }} /></div>
                <div className="row" style={{ marginTop: '0.5rem' }}>
                  <span style={{ opacity: 0.7 }}>Goal: ${goal.toLocaleString()}</span>
                  <span style={{ opacity: 0.7 }}>{goal - raised > 0 ? `$${(goal - raised).toLocaleString()} to go` : 'Funded!'}</span>
                </div>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)' }}>
                Help us complete the Library Media Center technology rollout — computers, books, and tools for every student.
              </div>

              <ul>
                <li><CheckCircle2 size={16} /> 100% of funds go to school projects</li>
                <li><CheckCircle2 size={16} /> Tax-deductible (where applicable)</li>
                <li><CheckCircle2 size={16} /> Quarterly impact reports to all donors</li>
                <li><CheckCircle2 size={16} /> Recognition on the donor wall</li>
              </ul>

              <div className="trust">
                <Lock size={14} /> Secure payment · <Shield size={14} /> SSL encrypted
                <CreditCard size={14} />
              </div>
            </Sidebar>
          </Layout>
        </Container>
      </Section>
    </>
  );
};
