import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

const Wrap = styled.section`
  padding: 5rem 0;
  background: white;
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const Banner = styled(motion.div)`
  position: relative;
  border-radius: 28px;
  padding: 4rem 3rem;
  background:
    radial-gradient(circle at 80% 30%, rgba(245, 183, 29, 0.18), transparent 50%),
    linear-gradient(135deg, var(--color-primary-900) 0%, var(--color-primary-700) 60%, var(--color-secondary-700) 100%);
  color: white;
  overflow: hidden;
  text-align: center;
  isolation: isolate;

  .bg-image {
    position: absolute;
    inset: 0;
    z-index: 0;
    opacity: 0.18;
    mix-blend-mode: overlay;
    pointer-events: none;
  }
  .bg-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 38%;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1;
    background-image:
      linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
    mask-image: radial-gradient(circle at 50% 50%, black, transparent 70%);
    pointer-events: none;
  }

  > .eyebrow,
  > h2,
  > p,
  > .actions,
  > .progress { position: relative; z-index: 2; }

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0.4rem 0.9rem;
    border-radius: 999px;
    background: rgba(255,255,255,0.12);
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 1.25rem;
    border: 1px solid rgba(255,255,255,0.16);
  }
  h2 {
    color: white;
    font-size: clamp(1.8rem, 3.6vw, 2.75rem);
    margin-bottom: 1rem;
    max-width: 22ch;
    margin-left: auto;
    margin-right: auto;
  }
  p {
    color: rgba(255,255,255,0.85);
    font-size: 1.05rem;
    margin: 0 auto 2rem;
    max-width: 60ch;
  }

  .actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .progress {
    margin-top: 3rem;
    max-width: 540px;
    margin-left: auto;
    margin-right: auto;
    text-align: left;

    .row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.85rem;
      color: rgba(255,255,255,0.85);
      margin-bottom: 0.6rem;
      font-weight: 600;
    }
    .pct {
      display: inline-flex;
      align-items: center;
      padding: 0.2rem 0.6rem;
      border-radius: 999px;
      background: rgba(245, 183, 29, 0.18);
      border: 1px solid rgba(245, 183, 29, 0.4);
      color: var(--color-accent-300);
      font-size: 0.78rem;
      font-weight: 800;
      letter-spacing: 0.5px;
    }
    .bar {
      width: 100%;
      height: 10px;
      background: rgba(255,255,255,0.12);
      border-radius: 999px;
      overflow: hidden;
      box-shadow: inset 0 1px 2px rgba(0,0,0,0.18);

      .fill {
        height: 100%;
        background: linear-gradient(90deg, var(--color-accent-400), var(--color-accent-600));
        border-radius: 999px;
        transition: width 1.2s cubic-bezier(0.22, 1, 0.36, 1);
        box-shadow: 0 0 12px rgba(245, 183, 29, 0.5);
      }
    }
  }
`;

export const FinalCTA = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const raised = 10100;
  const goal = 25000;
  const pct = Math.min(100, Math.round((raised / goal) * 100));

  return (
    <Wrap>
      <Container ref={ref}>
        <Banner
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-image" aria-hidden="true">
            <img src="/Atse_yohannes_bg.jpg" alt="" loading="lazy" decoding="async" />
          </div>
          <span className="eyebrow"><Sparkles size={14} /> Active Campaign</span>
          <h2>Help Us Equip the Library Media Center</h2>
          <p>
            We've built the LMC. Now we need your support to fully equip it with computers, books,
            and digital tools — empowering thousands of students for years to come.
          </p>
          <div className="actions">
            <Button to="/donate" variant="gold" size="lg">Donate Now <ArrowRight size={18} /></Button>
            <Button to="/projects" variant="outline" size="lg">
              <span style={{ color: 'white' }}>See the Project</span>
            </Button>
          </div>
          <div className="progress">
            <div className="row">
              <span>${raised.toLocaleString()} raised <span style={{ opacity: 0.6 }}>· of ${goal.toLocaleString()} goal</span></span>
              <span className="pct">{pct}% funded</span>
            </div>
            <div className="bar">
              <div className="fill" style={{ width: inView ? `${pct}%` : '0%' }} />
            </div>
          </div>
        </Banner>
      </Container>
    </Wrap>
  );
};
