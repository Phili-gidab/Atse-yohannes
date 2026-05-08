import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePrograms } from '../../hooks/useContent';
import { getIcon } from '../../utils/iconMap';
import type { Program } from '../../data/content';

const MotionLink = motion(Link);

const Wrap = styled.section`
  padding: 6rem 0;
  background: var(--color-neutral-50);
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const Header = styled.div`
  text-align: center;
  max-width: 720px;
  margin: 0 auto 3.5rem;

  .eyebrow {
    display: inline-block;
    color: var(--color-secondary-600);
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 1rem;
  }
  h2 { margin-bottom: 1rem; }
  p { color: var(--color-neutral-600); font-size: 1.075rem; margin: 0 auto; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled(MotionLink)`
  text-decoration: none;
  background: white;
  border-radius: 16px;
  padding: 1.75rem;
  border: 1px solid var(--color-neutral-200);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      var(--color-secondary-500),
      var(--color-accent-500),
      var(--color-primary-500)
    );
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .icon {
    width: 52px;
    height: 52px;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--color-primary-50), var(--color-secondary-50));
    color: var(--color-primary-700);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.25rem;
    transition: all 0.3s ease;
  }

  h3 {
    font-size: 1.2rem;
    margin-bottom: 0.75rem;
    color: var(--color-primary-900);
  }
  p {
    color: var(--color-neutral-600);
    font-size: 0.95rem;
    line-height: 1.6;
  }

  .arrow {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    color: var(--color-neutral-300);
    opacity: 0;
    transform: translate(-4px, 4px);
    transition: all 0.3s ease;
  }

  &:hover {
    transform: translateY(-6px);
    border-color: var(--color-secondary-300);
    box-shadow: 0 24px 48px -16px rgba(13, 148, 136, 0.15);

    &::before { transform: scaleX(1); }
    .icon {
      background: linear-gradient(135deg, var(--color-secondary-500), var(--color-secondary-700));
      color: white;
      transform: scale(1.05);
    }
    .arrow {
      opacity: 1;
      transform: translate(0, 0);
      color: var(--color-secondary-600);
    }
  }
`;

export const Programs = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { data: programs = [] } = usePrograms();

  return (
    <Wrap>
      <Container>
        <Header>
          <span className="eyebrow">Core Programs</span>
          <h2>How We Support the School</h2>
          <p>
            From infrastructure to academic excellence — every program is designed to lift
            students, teachers, and the broader school community.
          </p>
        </Header>
        <Grid ref={ref}>
          {(programs as Program[]).map((p, i) => {
            const Icon = getIcon(p.icon);
            return (
              <Card
                key={p.title}
                to="/projects"
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.07 }}
              >
                <span className="icon"><Icon size={24} /></span>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <ArrowUpRight className="arrow" size={20} />
              </Card>
            );
          })}
        </Grid>
      </Container>
    </Wrap>
  );
};
