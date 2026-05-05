import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useProjects } from '../../hooks/useContent';

interface Project {
  slug: string;
  title: string;
  status: string;
  image: string;
  problem: string;
}

const MotionLink = motion(Link);

const Wrap = styled.section`
  padding: 6rem 0;
  background: var(--color-neutral-100);
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: start;
  }

  .eyebrow {
    display: inline-block;
    color: var(--color-secondary-600);
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 0.5rem;
  }
  h2 { margin-bottom: 0.5rem; }
  p { color: var(--color-neutral-600); }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled(MotionLink)`
  background: white;
  border-radius: 18px;
  overflow: hidden;
  transition: all 0.35s ease;
  cursor: pointer;
  border: 1px solid transparent;
  text-decoration: none;
  color: inherit;

  .image {
    aspect-ratio: 4 / 3;
    overflow: hidden;
    position: relative;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s ease;
    }
  }

  .badge {
    position: absolute;
    top: 12px;
    left: 12px;
    padding: 0.35rem 0.75rem;
    border-radius: 999px;
    background: rgba(255,255,255,0.95);
    color: var(--color-primary-900);
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    backdrop-filter: blur(8px);
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  .badge svg { color: var(--color-success); }

  .body {
    padding: 1.25rem;

    h3 {
      font-size: 1.1rem;
      color: var(--color-primary-900);
      margin-bottom: 0.5rem;
    }
    p {
      color: var(--color-neutral-600);
      font-size: 0.9rem;
      line-height: 1.55;
      margin-bottom: 1rem;
    }
    .link {
      color: var(--color-secondary-700);
      font-weight: 600;
      font-size: 0.9rem;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-xl);
    border-color: var(--color-secondary-200);

    .image img { transform: scale(1.05); }
  }
`;

export const ProjectsOverview = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { data: projects = [] } = useProjects();
  const displayed = (projects as Project[]).slice(0, 4);

  return (
    <Wrap>
      <Container>
        <Header>
          <div>
            <span className="eyebrow">Active Projects</span>
            <h2>Where Your Support Lands</h2>
            <p>Real projects, real impact — at Atse Yohannes School in Mekelle.</p>
          </div>
          <Button to="/projects" variant="outline">View All Projects <ArrowRight size={16} /></Button>
        </Header>
        <Grid ref={ref}>
          {displayed.map((p, i) => (
            <Card
              key={p.slug}
              to="/projects"
              initial={{ opacity: 0, y: 22 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div className="image">
                <img src={p.image} alt={p.title} loading="lazy" />
                <span className="badge">
                  {p.status.startsWith('Completed') && <CheckCircle2 size={12} />}
                  {p.status}
                </span>
              </div>
              <div className="body">
                <h3>{p.title}</h3>
                <p>{p.problem}</p>
                <span className="link">Learn more <ArrowRight size={14} /></span>
              </div>
            </Card>
          ))}
        </Grid>
      </Container>
    </Wrap>
  );
};
