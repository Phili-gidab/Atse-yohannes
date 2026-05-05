import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Play } from 'lucide-react';
import { Button } from '../ui/Button';
import { useHero } from '../../hooks/useContent';

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-22px) rotate(6deg); }
`;

const glow = keyframes`
  0%, 100% { filter: drop-shadow(0 0 16px rgba(245, 183, 29, 0.45)); opacity: 0.85; }
  50% { filter: drop-shadow(0 0 32px rgba(245, 183, 29, 0.85)); opacity: 1; }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.06); }
`;

const Wrap = styled.section`
  position: relative;
  min-height: calc(100vh - 36px);
  display: flex;
  align-items: center;
  color: white;
  overflow: hidden;
  padding: 9rem 0 7rem;

  @media (max-width: 900px) {
    min-height: auto;
    padding: 7rem 0 5rem;
  }
  @media (max-width: 600px) {
    padding: 6rem 0 3.5rem;
  }
`;

const Background = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(10, 37, 64, 0.92) 0%,
      rgba(10, 37, 64, 0.86) 45%,
      rgba(20, 79, 122, 0.82) 100%
    );
    z-index: 1;
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    radial-gradient(circle at 18% 28%, rgba(20, 184, 166, 0.30), transparent 45%),
    radial-gradient(circle at 82% 22%, rgba(245, 183, 29, 0.18), transparent 50%),
    radial-gradient(ellipse at center, transparent 0%, rgba(10, 37, 64, 0.35) 100%);
`;

const Grid = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%);
`;

const FloatingDot = styled.div<{ $top: string; $left: string; $delay: number; $size: number }>`
  position: absolute;
  z-index: 1;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(245, 183, 29, 0.32), rgba(20, 184, 166, 0.12));
  animation: ${float} ${({ $delay }) => 5 + $delay}s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay}s;
  pointer-events: none;
  filter: blur(0.5px);

  @media (max-width: 768px) { display: none; }
`;

const Container = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1040px;
  margin: 0 auto;
  padding: 0 var(--container-padding);
  text-align: center;
`;

const Eyebrow = styled(motion.span)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 1.15rem;
  border-radius: 999px;
  background: rgba(245, 183, 29, 0.14);
  border: 1px solid rgba(245, 183, 29, 0.32);
  color: var(--color-accent-300);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(6px);

  svg { animation: ${glow} 2.4s ease-in-out infinite; }
`;

const Headline = styled(motion.h1)`
  color: white;
  font-size: clamp(2.4rem, 5.4vw, 4.4rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin-bottom: 1.5rem;
  text-shadow: 0 4px 40px rgba(0, 0, 0, 0.45);

  .accent {
    display: inline-block;
    background: linear-gradient(120deg, var(--color-accent-300), #ffd66b 50%, var(--color-accent-500));
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: ${shimmer} 4s linear infinite;
  }
`;

const Subtext = styled(motion.p)`
  color: rgba(255, 255, 255, 0.92);
  font-size: clamp(1.05rem, 1.6vw, 1.25rem);
  max-width: 64ch;
  margin: 0 auto 2.25rem;
  line-height: 1.7;
`;

const Actions = styled(motion.div)`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    max-width: 320px;
    margin: 0 auto;
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.95rem 1.85rem;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.32);
  border-radius: 10px;
  color: white;
  font-family: var(--font-heading);
  font-size: 0.92rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;

  &:hover {
    background: rgba(255, 255, 255, 0.14);
    border-color: rgba(255, 255, 255, 0.6);
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  }

  &:active { transform: translateY(-1px); }
`;

const PlayIcon = styled.span`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  animation: ${pulse} 2.2s ease-in-out infinite;
`;

const Stats = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 3.25rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.14);
  flex-wrap: wrap;

  @media (max-width: 600px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem 1rem;
    margin-top: 2.25rem;
    padding-top: 1.5rem;
  }
`;

const Stat = styled.div`
  text-align: center;

  .num {
    font-family: var(--font-heading);
    font-size: clamp(1.55rem, 4.5vw, 1.95rem);
    font-weight: 800;
    color: var(--color-accent-300);
    line-height: 1;
    letter-spacing: -0.02em;
  }
  .lbl {
    font-size: 0.78rem;
    color: rgba(255, 255, 255, 0.72);
    text-transform: uppercase;
    letter-spacing: 0.7px;
    margin-top: 0.45rem;
    font-weight: 600;
  }
`;

export const Hero = () => {
  const { data: hero } = useHero();
  const bgImage = hero?.backgroundImage || '/2e595e1316ac68a639018427a63548ff.jpg';

  return (
    <Wrap>
      <Background>
        <img src={bgImage} alt="AYAA community at Atse Yohannes School" />
      </Background>
      <Overlay />
      <Grid />

      <FloatingDot $top="14%" $left="8%" $delay={0} $size={84} />
      <FloatingDot $top="62%" $left="6%" $delay={1.4} $size={52} />
      <FloatingDot $top="22%" $left="86%" $delay={0.7} $size={64} />
      <FloatingDot $top="68%" $left="90%" $delay={2.1} $size={42} />

      <Container>
        <Eyebrow
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Heart size={14} />
          {hero?.eyebrow}
        </Eyebrow>

        <Headline
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
        >
          Empowering Education at <br />
          <span className="accent">Atse Yohannes School</span>
        </Headline>

        <Subtext
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          {hero?.subtext}
        </Subtext>

        <Actions
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button to={hero?.primaryCta.href ?? '/donate'} variant="gold" size="lg">
            {hero?.primaryCta.label} <ArrowRight size={18} />
          </Button>
          <SecondaryButton to={hero?.secondaryCta.href ?? '/get-involved'}>
            <PlayIcon><Play size={14} fill="white" /></PlayIcon>
            {hero?.secondaryCta.label}
          </SecondaryButton>
        </Actions>

        <Stats
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
        >
          <Stat>
            <div className="num">2003</div>
            <div className="lbl">Established</div>
          </Stat>
          <Stat>
            <div className="num">3</div>
            <div className="lbl">Global Chapters</div>
          </Stat>
          <Stat>
            <div className="num">$10K+</div>
            <div className="lbl">Funds Raised</div>
          </Stat>
          <Stat>
            <div className="num">8M+</div>
            <div className="lbl">Birr for LMC</div>
          </Stat>
        </Stats>
      </Container>
    </Wrap>
  );
};
