import { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { CheckCircle2, CreditCard, Lock, Shield, Heart, Mail } from 'lucide-react';
import { PageHero } from '../components/sections/PageHero';
import { ORG } from '../data/content';
import { useCampaign } from '../hooks/useContent';

const Section = styled.section`
  padding: 5rem 0;

  @media (max-width: 700px) { padding: 2.5rem 0 3.5rem; }
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: 4rem;

  @media (max-width: 1024px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 2.5rem;
  }
`;

const CustomAmount = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
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
    min-width: 0;
    border: none;
    outline: none;
    font-size: 1.2rem;
    font-family: var(--font-heading);
    font-weight: 700;
    color: var(--color-primary-900);
    background: transparent;

    /* Hide the number-input spinner buttons for a cleaner look — donors
       still type freely, and tier clicks populate the field. */
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
    &[type='number'] { -moz-appearance: textfield; appearance: textfield; }
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

  @media (max-width: 600px) {
    padding: 1.5rem;
    border-radius: 18px;
    position: static;
  }

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

const PaypalForm = styled.form`
  margin: 0;

  .paypal-btn {
    width: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.65rem;
    padding: 1.1rem 1.5rem;
    border: none;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--color-accent-500), var(--color-accent-600));
    color: var(--color-primary-950);
    font-family: var(--font-heading);
    font-weight: 800;
    font-size: 1rem;
    letter-spacing: 0.4px;
    cursor: pointer;
    box-shadow: 0 12px 30px rgba(245, 183, 29, 0.32);
    transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 18px 40px rgba(245, 183, 29, 0.42);
    }
    &:disabled {
      opacity: 0.55;
      cursor: not-allowed;
      box-shadow: none;
    }
  }
`;

const CheckPanel = styled.div`
  margin-top: 1.5rem;
  padding: 1.1rem 1.25rem;
  background: var(--color-neutral-50);
  border: 1px dashed var(--color-neutral-300);
  border-radius: 14px;
  display: flex;
  align-items: center;
  gap: 0.85rem;

  .ic {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: white;
    border: 1px solid var(--color-neutral-200);
    color: var(--color-primary-700);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .t {
    font-weight: 700;
    color: var(--color-primary-900);
    font-size: 0.95rem;
    margin-bottom: 0.15rem;
  }
  .b {
    color: var(--color-neutral-700);
    font-size: 0.88rem;
  }
`;

const Header = styled.div`
  margin-bottom: 2rem;
  min-width: 0;

  .eyebrow {
    color: var(--color-secondary-600);
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 0.6rem;
    display: inline-block;
  }
  h2 {
    margin-bottom: 0.6rem;
    font-size: clamp(1.4rem, 5.5vw, 2.25rem);
  }
  p { color: var(--color-neutral-600); }
`;

export const Donate = () => {
  // Donors type whatever amount they like — no preset tiers. PayPal's
  // `_xclick-subscriptions` monthly flow was removed because it forces donors
  // to create a PayPal account, which kills the guest card-payment path.
  const [customAmount, setCustomAmount] = useState<string>('');

  const { data: campaign } = useCampaign();
  const raised = campaign?.raised ?? 0;
  const goal = campaign?.goal ?? 0;
  const pct = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;

  const amount = useMemo(() => {
    const n = Number(customAmount);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }, [customAmount]);

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
            <div>
              <Header>
                <span className="eyebrow">Choose Your Impact</span>
                <h2>Enter your donation amount</h2>
                <p>Give whatever you like — every donation goes directly to school programs and infrastructure.</p>
              </Header>

              <CustomAmount>
                <span className="currency">$</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Enter any amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  aria-label="Donation amount in USD"
                />
              </CustomAmount>

              <PaypalForm
                action="https://www.paypal.com/cgi-bin/webscr"
                method="post"
                target="_blank"
                onSubmit={(e) => {
                  if (!amount) e.preventDefault();
                }}
              >
                <input type="hidden" name="cmd" value="_donations" />
                <input type="hidden" name="business" value={ORG.paypal.business} />
                <input type="hidden" name="item_name" value={ORG.paypal.itemName} />
                <input type="hidden" name="currency_code" value={ORG.paypal.currency} />
                <input type="hidden" name="amount" value={amount} />
                <input type="hidden" name="no_note" value="0" />
                <input type="hidden" name="no_shipping" value="1" />
                <input type="hidden" name="return" value={window.location.origin + '/donate?status=thanks'} />
                <button type="submit" className="paypal-btn" disabled={!amount}>
                  <Heart size={18} />
                  {amount ? `Donate $${amount}` : 'Enter an amount to continue'}
                </button>
              </PaypalForm>

              <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--color-neutral-500)', textAlign: 'center' }}>
                Secure checkout through PayPal — credit/debit cards accepted, no PayPal account required.
              </p>

              <CheckPanel>
                <span className="ic"><Mail size={18} /></span>
                <div>
                  <div className="t">Prefer to donate by check?</div>
                  <div className="b">Mail to: <strong>{ORG.mailingAddress}</strong></div>
                </div>
              </CheckPanel>
            </div>

            <Sidebar>
              <h3>{campaign?.title}</h3>
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
                {campaign?.description}
              </div>

              <ul>
                {(campaign?.benefits ?? []).map((benefit) => (
                  <li key={benefit}><CheckCircle2 size={16} /> {benefit}</li>
                ))}
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
