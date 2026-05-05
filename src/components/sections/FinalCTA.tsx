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

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
    mask-image: radial-gradient(circle at 50% 50%, black, transparent 70%);
  }

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
      font-size: 0.85rem;
      color: rgba(255,255,255,0.85);
      margin-bottom: 0.5rem;
      font-weight: 600;
    }
    .bar {
      width: 100%;
      height: 10px;
      background: rgba(255,255,255,0.12);
      border-radius: 999px;
      overflow: hidden;

      .fill {
        height: 100%;
        background: linear-gradient(90deg, var(--color-accent-400), var(--color-accent-600));
        border-radius: 999px;
        transition: width 1.2s cubic-bezier(0.22, 1, 0.36, 1);
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
              <span>${raised.toLocaleString()} raised</span>
              <span>Goal: ${goal.toLocaleString()}</span>
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
