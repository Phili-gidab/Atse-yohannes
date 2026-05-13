import { useRef } from 'react';
import styled from '@emotion/styled';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useImpactMetrics } from '../../hooks/useContent';

interface Metric { value: string; label: string }

const Wrap = styled.section`
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: 8rem 0;
  margin-top: -1px;
  z-index: 2;
  color: white;

  @media (max-width: 900px) {
    padding: 6rem 0;
  }
`;

const Parallax = styled(motion.div)`
  position: absolute;
  left: 0;
  right: 0;
  top: -15%;
  bottom: -15%;
  z-index: -2;
  will-change: transform;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 38%;
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(circle at 78% 22%, rgba(20, 184, 166, 0.32), transparent 55%),
    linear-gradient(
      135deg,
      rgba(23, 37, 84, 0.92) 0%,
      rgba(30, 64, 175, 0.86) 55%,
      rgba(15, 118, 110, 0.78) 100%
    );
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
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem 1rem;
  }
`;

const Item = styled(motion.div)`
  position: relative;
  text-align: center;
  padding: 1rem 1rem 1.25rem;
  border-right: 1px solid rgba(255, 255, 255, 0.14);
  transition: transform 0.3s ease;

  &:last-of-type { border-right: none; }

  .num {
    font-family: var(--font-heading);
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800;
    background: linear-gradient(135deg, #ffffff 0%, var(--color-accent-300) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    line-height: 1;
    text-shadow: 0 4px 24px rgba(0, 0, 0, 0.18);
    transition: transform 0.3s ease;
  }
  .lbl {
    margin-top: 0.6rem;
    color: rgba(255, 255, 255, 0.82);
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
    border-right: 1px solid rgba(255, 255, 255, 0.14);
    border-bottom: 1px solid rgba(255, 255, 255, 0.14);
    padding: 1rem 0.75rem 1.25rem;

    &:nth-of-type(2n) { border-right: none; }
    &:nth-last-of-type(-n + 2):nth-of-type(2n + 1) { border-bottom: none; }
    &:last-of-type:nth-of-type(2n + 1) {
      grid-column: 1 / -1;
      border-right: none;
      border-bottom: none;
    }
  }
`;

export const ImpactMetrics = () => {
  const wrapRef = useRef<HTMLElement | null>(null);
  const { ref: inViewRef, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { data: metrics = [] } = useImpactMetrics();
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start end', 'end start'],
  });
  const yMotion = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const y = reduceMotion ? '0%' : yMotion;

  const setRefs = (el: HTMLElement | null) => {
    wrapRef.current = el;
    inViewRef(el);
  };

  return (
    <Wrap ref={setRefs}>
      <Parallax style={{ y }}>
        <img
          src="/Atse_yohannes_bg.jpg"
          alt=""
          aria-hidden="true"
          loading="eager"
          decoding="async"
        />
      </Parallax>
      <Overlay />
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
