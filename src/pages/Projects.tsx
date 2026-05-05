import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { PageHero } from '../components/sections/PageHero';
import { useProjects } from '../hooks/useContent';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

interface Project {
  slug: string;
  title: string;
  status: string;
  image: string;
  problem: string;
  action: string;
  impact: string[];
}
import { Button } from '../components/ui/Button';

const Section = styled.section`
  padding: 5rem 0;
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const List = styled.div`
  display: grid;
  gap: 2rem;
`;

const Project = styled(motion.div)`
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 2.5rem;
  background: white;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: var(--shadow-md);

  &:nth-of-type(even) {
    grid-template-columns: 1.1fr 0.9fr;
    .image-wrap { order: 2; }
    .body { order: 1; }
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr !important;
    .image-wrap { order: 0 !important; }
    .body { order: 0 !important; }
  }

  .image-wrap {
    position: relative;
    aspect-ratio: 4 / 3;
    overflow: hidden;

    img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }

    .badge {
      position: absolute;
      top: 16px;
      left: 16px;
      padding: 0.4rem 0.85rem;
      border-radius: 999px;
      background: rgba(255,255,255,0.95);
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      backdrop-filter: blur(8px);

      &.completed { color: var(--color-success); }
      &.ongoing { color: var(--color-warning); }
      &.active { color: var(--color-secondary-700); }
    }
  }

  &:hover .image-wrap img { transform: scale(1.04); }

  .body {
    padding: 2.25rem;
    display: flex;
    flex-direction: column;
    justify-content: center;

    h2 { color: var(--color-primary-900); margin-bottom: 1rem; font-size: 1.65rem; }
    .block {
      margin-bottom: 1rem;
      .label {
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 1px;
        text-transform: uppercase;
        margin-bottom: 0.4rem;
      }
      .label.problem { color: var(--color-error); }
      .label.action { color: var(--color-info); }
      .label.impact { color: var(--color-success); }

      p { color: var(--color-neutral-700); margin: 0; }
    }
    ul {
      list-style: none;
      padding: 0;
      margin-top: 0.5rem;
      display: grid;
      gap: 0.5rem;

      li {
        display: flex;
        align-items: start;
        gap: 0.5rem;
        color: var(--color-neutral-700);
        font-size: 0.95rem;

        &::before {
          content: '';
          flex-shrink: 0;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--color-secondary-500);
          margin-top: 8px;
        }
      }
    }
  }
`;

const statusIcon = (status: string) => {
  if (status.startsWith('Completed')) return <CheckCircle2 size={12} />;
  if (status.startsWith('Building')) return <Clock size={12} />;
  if (status.startsWith('Active')) return <AlertCircle size={12} />;
  return <Clock size={12} />;
};

const statusClass = (status: string) => {
  if (status.startsWith('Completed')) return 'completed';
  if (status.startsWith('Active')) return 'active';
  return 'ongoing';
};

export const Projects = () => {
  useDocumentTitle('Projects', 'AYAA projects at Atse Yohannes School — Library Media Center, STEM, infrastructure, and more.');
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });
  const { data: projectsData = [] } = useProjects();
  const PROJECTS = projectsData as Project[];

  return (
    <>
      <PageHero
        eyebrow="Our Projects"
        title="Where Alumni Support Becomes Real"
        subtitle="Every AYAA project starts with a real challenge at the school — and ends with a measurable impact for students."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Projects' }]}
      />
      <Section>
        <Container>
          <List ref={ref}>
            {PROJECTS.map((p, i) => (
              <Project
                key={p.slug}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.05 }}
              >
                <div className="image-wrap">
                  <img src={p.image} alt={p.title} loading="lazy" />
                  <span className={`badge ${statusClass(p.status)}`}>
                    {statusIcon(p.status)} {p.status}
                  </span>
                </div>
                <div className="body">
                  <h2>{p.title}</h2>
                  <div className="block">
                    <div className="label problem">The Problem</div>
                    <p>{p.problem}</p>
                  </div>
                  <div className="block">
                    <div className="label action">Our Action</div>
                    <p>{p.action}</p>
                  </div>
                  <div className="block">
                    <div className="label impact">The Impact</div>
                    <ul>
                      {p.impact.map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ul>
                  </div>
                  <div style={{ marginTop: '1.5rem' }}>
                    <Button to="/donate" variant="secondary" size="sm">Support This Project</Button>
                  </div>
                </div>
              </Project>
            ))}
          </List>
        </Container>
      </Section>
    </>
  );
};
