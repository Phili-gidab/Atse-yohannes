import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { TrendingUp, Award, Users, Building2, Quote } from 'lucide-react';
import { PageHero } from '../components/sections/PageHero';
import { useImpactMetrics } from '../hooks/useContent';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

interface Metric { value: string; label: string }

const Section = styled.section`
  padding: 5rem 0;
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const Highlights = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  margin-bottom: 4rem;

  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 540px) { grid-template-columns: 1fr; }
`;

const Metric = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 1.75rem;
  border: 1px solid var(--color-neutral-200);
  text-align: center;

  .icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--color-secondary-50), var(--color-primary-50));
    color: var(--color-primary-700);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
  }
  .num {
    font-family: var(--font-heading);
    font-size: 2.2rem;
    font-weight: 800;
    color: var(--color-primary-900);
    line-height: 1;
  }
  .lbl {
    color: var(--color-neutral-600);
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }
`;

const Achievements = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: 900px) { grid-template-columns: 1fr; }

  .image {
    border-radius: 24px;
    overflow: hidden;
    aspect-ratio: 4 / 5;
    box-shadow: var(--shadow-premium);
    img { width: 100%; height: 100%; object-fit: cover; }
  }

  .text {
    .eyebrow {
      color: var(--color-secondary-600);
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 0.75rem;
      display: inline-block;
    }
    h2 { margin-bottom: 1.5rem; }

    ul {
      list-style: none;
      padding: 0;
      display: grid;
      gap: 0.85rem;

      li {
        display: flex;
        align-items: start;
        gap: 0.75rem;
        padding: 1rem 1.25rem;
        background: var(--color-neutral-50);
        border-radius: 12px;
        border-left: 3px solid var(--color-secondary-500);

        .check {
          flex-shrink: 0;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: var(--color-secondary-100);
          color: var(--color-secondary-700);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .body {
          font-size: 0.97rem;
          color: var(--color-neutral-700);
          font-weight: 500;
        }
      }
    }
  }
`;

const StoryBlock = styled.div`
  background:
    radial-gradient(circle at 80% 20%, rgba(245, 183, 29, 0.15), transparent 50%),
    linear-gradient(135deg, var(--color-primary-900), var(--color-primary-800));
  border-radius: 28px;
  padding: 4rem;
  color: white;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2rem;
  align-items: start;

  @media (max-width: 700px) {
    padding: 2.25rem;
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  .qmark {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    background: var(--color-accent-500);
    color: white;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .quote {
    font-family: var(--font-heading);
    font-size: 1.4rem;
    line-height: 1.5;
    color: white;
    margin-bottom: 1rem;
  }
  .att {
    color: rgba(255,255,255,0.7);
    font-style: italic;
  }
`;

const ACHIEVEMENTS = [
  'Raised over $10,100 USD and 8 million birr for school projects',
  'Built and improved critical school infrastructure (LMC, fence, bathrooms)',
  'Funded STEM and academic competition programs',
  'Strengthened a global alumni engagement network across multiple chapters',
  'Equipped the computer lab through the “One Person, One Laptop” initiative',
];

export const Impact = () => {
  useDocumentTitle('Our Impact', 'Measurable change at Atse Yohannes School — funds raised, infrastructure built, students supported.');
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { data: metricsData = [] } = useImpactMetrics();
  const IMPACT_METRICS = metricsData as Metric[];

  return (
    <>
      <PageHero
        eyebrow="Our Impact"
        title="Measurable Change at Atse Yohannes School"
        subtitle="Every dollar, every project, every alumni connection adds up to a measurable shift in opportunity for students."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Impact' }]}
      />

      <Section>
        <Container>
          <Highlights ref={ref}>
            {[
              { icon: TrendingUp, m: IMPACT_METRICS[0] },
              { icon: Building2, m: IMPACT_METRICS[1] },
              { icon: Award, m: IMPACT_METRICS[2] },
              { icon: Users, m: IMPACT_METRICS[3] },
            ].map((it, i) => {
              const Icon = it.icon;
              return (
                <Metric
                  key={it.m.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                >
                  <span className="icon"><Icon size={24} /></span>
                  <div className="num">{it.m.value}</div>
                  <div className="lbl">{it.m.label}</div>
                </Metric>
              );
            })}
          </Highlights>

          <Achievements>
            <div className="image">
              <img
                src="/68f2ee741ffb2feedf27a150f6a1542f.jpg"
                alt="Library Media Center construction at Atse Yohannes School"
              />
            </div>
            <div className="text">
              <span className="eyebrow">Key Achievements</span>
              <h2>What We've Accomplished Together</h2>
              <ul>
                {ACHIEVEMENTS.map((a) => (
                  <li key={a}>
                    <span className="check"><Award size={14} /></span>
                    <span className="body">{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Achievements>
        </Container>
      </Section>

      <Section style={{ background: 'var(--color-neutral-50)' }}>
        <Container>
          <StoryBlock>
            <span className="qmark"><Quote size={28} /></span>
            <div>
              <div className="quote">
                "The construction of bathrooms for female students significantly improved
                their school experience, addressing a long-standing issue that affected
                attendance and well-being."
              </div>
              <div className="att">— AYAA Project Report, Girls Bathroom Project</div>
            </div>
          </StoryBlock>
        </Container>
      </Section>
    </>
  );
};
