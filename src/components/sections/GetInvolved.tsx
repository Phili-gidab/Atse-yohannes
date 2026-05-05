import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Heart, Users, Megaphone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Wrap = styled.section`
  padding: 6rem 0;
  background: white;
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const Header = styled.div`
  text-align: center;
  max-width: 720px;
  margin: 0 auto 3rem;

  .eyebrow {
    display: inline-block;
    color: var(--color-secondary-600);
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 1rem;
  }
  h2 { margin-bottom: 0.75rem; }
  p { color: var(--color-neutral-600); margin: 0 auto; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled(motion.div)<{ $tone: 'gold' | 'teal' | 'navy' }>`
  position: relative;
  border-radius: 22px;
  padding: 2.25rem;
  color: white;
  overflow: hidden;
  min-height: 260px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.35s ease;

  ${({ $tone }) => {
    const tones = {
      gold: `background: linear-gradient(135deg, var(--color-accent-500), var(--color-accent-700));
             color: var(--color-primary-950);`,
      teal: `background: linear-gradient(135deg, var(--color-secondary-600), var(--color-secondary-800));`,
      navy: `background: linear-gradient(135deg, var(--color-primary-800), var(--color-primary-950));`,
    };
    return tones[$tone];
  }}

  &::before {
    content: '';
    position: absolute;
    width: 220px;
    height: 220px;
    border-radius: 50%;
    background: rgba(255,255,255,0.08);
    top: -100px;
    right: -80px;
  }

  .icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: rgba(255,255,255,0.18);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.25rem;
  }
  h3 { color: inherit; font-size: 1.35rem; margin-bottom: 0.6rem; }
  p { color: inherit; opacity: 0.92; max-width: none; font-size: 0.95rem; margin-bottom: 1.5rem; }

  .cta {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-weight: 700;
    text-decoration: none;
    color: inherit;
    transition: gap 0.2s ease;

    &:hover { gap: 12px; }
  }

  &:hover { transform: translateY(-6px); }
`;

const items: Array<{ tone: 'gold' | 'teal' | 'navy'; icon: typeof Heart; title: string; body: string; cta: string; href: string }> = [
  {
    tone: 'gold',
    icon: Heart,
    title: 'Donate',
    body: 'Every contribution directly funds books, scholarships, and infrastructure for students in Mekelle.',
    cta: 'Donate Now',
    href: '/donate',
  },
  {
    tone: 'teal',
    icon: Users,
    title: 'Join the Network',
    body: 'Become an alumni member, mentor a student, and connect with chapters across the world.',
    cta: 'Join AYAA',
    href: '/get-involved',
  },
  {
    tone: 'navy',
    icon: Megaphone,
    title: 'Spread the Word',
    body: 'Share AYAA’s mission with your network — visibility multiplies impact.',
    cta: 'Share Our Story',
    href: '/contact',
  },
];

export const GetInvolved = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <Wrap>
      <Container>
        <Header>
          <span className="eyebrow">Get Involved</span>
          <h2>Three Ways to Support AYAA</h2>
          <p>Whether you give, join, or share — your action carries the mission forward.</p>
        </Header>
        <Grid ref={ref}>
          {items.map((it, i) => {
            const Icon = it.icon;
            return (
              <Card
                key={it.title}
                $tone={it.tone}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div>
                  <span className="icon"><Icon size={22} /></span>
                  <h3>{it.title}</h3>
                  <p>{it.body}</p>
                </div>
                <Link className="cta" to={it.href}>{it.cta} <ArrowRight size={16} /></Link>
              </Card>
            );
          })}
        </Grid>
      </Container>
    </Wrap>
  );
};
