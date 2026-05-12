import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useImpactMetrics } from '../../hooks/useContent';

interface Metric { value: string; label: string }

const Wrap = styled.section`
  background: white;
  padding: 4rem 0;
  border-bottom: 1px solid var(--color-neutral-100);
  margin-top: -1px;
  position: relative;
  z-index: 2;
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
`;

const Item = styled(motion.div)`
  position: relative;
  text-align: center;
  padding: 1rem 1rem 1.25rem;
  border-right: 1px solid var(--color-neutral-100);
  transition: transform 0.3s ease;

  &:last-of-type { border-right: none; }

  .num {
    font-family: var(--font-heading);
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800;
    background: linear-gradient(135deg, var(--color-primary-700), var(--color-secondary-600));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    line-height: 1;
    transition: transform 0.3s ease;
  }
  .lbl {
    margin-top: 0.6rem;
    color: var(--color-neutral-600);
    font-size: 0.92rem;
    font-weight: 500;
  }

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: 0.35rem;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    border-radius: 2px;
    background: linear-gradient(90deg, var(--color-accent-400), var(--color-accent-600));
    transition: width 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  }

  &:hover {
    .num { transform: translateY(-2px) scale(1.04); }
    &::after { width: 36px; }
  }

  @media (max-width: 900px) {
    border-right: none;
    border-bottom: 1px solid var(--color-neutral-100);
    padding-bottom: 1.25rem;

    &:last-of-type {
      border-bottom: none;
      padding-bottom: 0;
    }
  }
`;

export const ImpactMetrics = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { data: metrics = [] } = useImpactMetrics();

  return (
    <Wrap ref={ref}>
      <Container>
        <Grid>
          {(metrics as Metric[]).map((m, i) => (
            <Item
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div className="num">{m.value}</div>
              <div className="lbl">{m.label}</div>
            </Item>
          ))}
        </Grid>
      </Container>
    </Wrap>
  );
};
