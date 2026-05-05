import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { PageHero } from '../components/sections/PageHero';
import { HOW_WE_WORK, VALUES as VALUES_SEED, LEADERSHIP as LEADERSHIP_SEED, COMMITTEES as COMMITTEES_SEED } from '../data/content';
import { useOrg, useOurStory, useLeadership } from '../hooks/useContent';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { getIcon } from '../utils/iconMap';

interface ValueItem { icon: string; title: string; body: string }
interface LeaderItem { name: string; role: string; initials: string }

const Section = styled.section`
  padding: 5rem 0;
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const StoryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

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
    h2 { margin-bottom: 1.25rem; }
    p {
      font-size: 1.05rem;
      line-height: 1.75;
      color: var(--color-neutral-700);
      max-width: none;
    }
    .meta {
      margin-top: 1.5rem;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;

      .item {
        padding: 1rem;
        background: var(--color-neutral-50);
        border-radius: 12px;
        border-left: 3px solid var(--color-secondary-500);
      }
      .label {
        font-size: 0.78rem;
        text-transform: uppercase;
        letter-spacing: 0.6px;
        color: var(--color-neutral-500);
        font-weight: 700;
        margin-bottom: 0.25rem;
      }
      .value {
        font-family: var(--font-heading);
        font-weight: 700;
        color: var(--color-primary-900);
      }
    }
  }
`;

const Values = styled.section`
  padding: 5rem 0;
  background: var(--color-neutral-50);
`;

const ValueGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const ValueCard = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 18px;
  box-shadow: var(--shadow-md);
  border-top: 4px solid var(--color-secondary-500);

  .icon {
    width: 52px;
    height: 52px;
    border-radius: 12px;
    background: var(--color-secondary-50);
    color: var(--color-secondary-700);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.25rem;
  }
  h3 { color: var(--color-primary-900); margin-bottom: 0.5rem; }
  p { color: var(--color-neutral-600); font-size: 0.97rem; }
`;

const HowGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;

  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const Step = styled(motion.div)`
  background: white;
  padding: 1.75rem;
  border-radius: 16px;
  border: 1px solid var(--color-neutral-200);
  position: relative;

  .num {
    font-family: var(--font-heading);
    font-size: 2.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, var(--color-secondary-500), var(--color-primary-700));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    line-height: 1;
    margin-bottom: 0.75rem;
  }
  h3 { font-size: 1.05rem; margin-bottom: 0.5rem; color: var(--color-primary-900); }
  p { font-size: 0.92rem; color: var(--color-neutral-600); }
`;

const LeadershipGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;

  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

const Leader = styled(motion.div)`
  background: white;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
  text-align: center;

  .avatar {
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background:
      radial-gradient(circle at 30% 30%, rgba(245, 183, 29, 0.25), transparent 60%),
      linear-gradient(135deg, var(--color-primary-800), var(--color-primary-950));
    color: var(--color-accent-300);
    font-family: var(--font-heading);
    font-size: clamp(2.6rem, 4vw, 3.4rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    transition: transform 0.5s ease;
    position: relative;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
      background-size: 24px 24px;
      mask-image: radial-gradient(circle at 50% 50%, black, transparent 75%);
    }
  }
  .body {
    padding: 1.25rem;
  }
  .name {
    font-family: var(--font-heading);
    font-weight: 700;
    color: var(--color-primary-900);
    margin-bottom: 0.25rem;
  }
  .role {
    font-size: 0.85rem;
    color: var(--color-secondary-700);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
    .avatar { transform: scale(1.04); }
  }
`;

const Committees = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2rem;
  justify-content: center;

  span {
    padding: 0.6rem 1rem;
    background: white;
    border: 1px solid var(--color-neutral-200);
    border-radius: 999px;
    color: var(--color-primary-800);
    font-size: 0.88rem;
    font-weight: 600;
  }
`;

const SectionHeader = styled.div`
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
    margin-bottom: 0.75rem;
  }
  h2 { margin-bottom: 0.75rem; }
  p { color: var(--color-neutral-600); margin: 0 auto; }
`;

export const About = () => {
  const { ref: r1, inView: v1 } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: r2, inView: v2 } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: r3, inView: v3 } = useInView({ triggerOnce: true, threshold: 0.1 });

  useDocumentTitle('About', 'Learn about AYAA — our mission, leadership, and the story of how alumni built a global network to support Atse Yohannes School.');
  const { data: org } = useOrg();
  const { data: ourStory } = useOurStory();
  const { data: leaders = [] } = useLeadership();
  const VALUES: ValueItem[] = VALUES_SEED;
  const COMMITTEES: string[] = COMMITTEES_SEED;
  const leadership = (leaders.length > 0 ? leaders : LEADERSHIP_SEED) as LeaderItem[];

  return (
    <>
      <PageHero
        eyebrow="About AYAA"
        title="A Network Built for Impact"
        subtitle="Atse Yohannes Alumni Association is a non-profit, non-political network connecting alumni and supporters worldwide to improve the quality of education at Atse Yohannes School."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]}
      />

      <Section>
        <Container>
          <StoryGrid>
            <div className="image">
              <img
                src="/a355a371ac73c1b6b23ba867aec6ae33.jpg"
                alt="Atse Yohannes School students — historic photo"
              />
            </div>
            <div className="text">
              <span className="eyebrow">Our Story</span>
              <h2>From a Few Alumni to a Global Movement</h2>
              <p>{ourStory?.body}</p>
              <div className="meta">
                <div className="item">
                  <div className="label">Founded</div>
                  <div className="value">{org?.founded}</div>
                </div>
                <div className="item">
                  <div className="label">Headquartered</div>
                  <div className="value">{org?.location}</div>
                </div>
              </div>
            </div>
          </StoryGrid>
        </Container>
      </Section>

      <Values>
        <Container>
          <SectionHeader>
            <span className="eyebrow">What Drives Us</span>
            <h2>Mission, Vision & Identity</h2>
            <p>The principles that guide every project, partnership, and decision at AYAA.</p>
          </SectionHeader>
          <ValueGrid ref={r1}>
            {VALUES.map((v, i) => {
              const Icon = getIcon(v.icon);
              return (
                <ValueCard
                  key={v.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={v1 ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <span className="icon"><Icon size={24} /></span>
                  <h3>{v.title}</h3>
                  <p>{v.body}</p>
                </ValueCard>
              );
            })}
          </ValueGrid>
        </Container>
      </Values>

      <Section>
        <Container>
          <SectionHeader>
            <span className="eyebrow">How We Work</span>
            <h2>A Repeatable Path to Impact</h2>
            <p>From identifying needs to sustained improvement — a clear, accountable process.</p>
          </SectionHeader>
          <HowGrid ref={r2}>
            {HOW_WE_WORK.map((s, i) => (
              <Step
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                animate={v2 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div className="num">{s.step}</div>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
              </Step>
            ))}
          </HowGrid>
        </Container>
      </Section>

      <Values>
        <Container>
          <SectionHeader>
            <span className="eyebrow">Leadership</span>
            <h2>Meet the AYAA Team</h2>
            <p>A dedicated board of alumni leading the work and committees driving change.</p>
          </SectionHeader>
          <LeadershipGrid ref={r3}>
            {leadership.map((p, i) => (
              <Leader
                key={p.name}
                initial={{ opacity: 0, y: 20 }}
                animate={v3 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div className="avatar"><span>{p.initials}</span></div>
                <div className="body">
                  <div className="name">{p.name}</div>
                  <div className="role">{p.role}</div>
                </div>
              </Leader>
            ))}
          </LeadershipGrid>
          <Committees>
            {COMMITTEES.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </Committees>
        </Container>
      </Values>
    </>
  );
};
