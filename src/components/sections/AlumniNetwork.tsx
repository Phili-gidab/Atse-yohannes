import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Globe2, MapPin } from 'lucide-react';
import { useChapters } from '../../hooks/useContent';

interface Chapter { name: string; cities: string[] }

const Wrap = styled.section`
  padding: 6rem 0;
  color: white;
  position: relative;
  overflow: hidden;
  isolation: isolate;

  .bg-image {
    position: absolute;
    inset: 0;
    z-index: -2;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 35%;
    }
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background:
      radial-gradient(circle at 80% 20%, rgba(20, 184, 166, 0.20), transparent 50%),
      linear-gradient(180deg, rgba(30, 58, 138, 0.94) 0%, rgba(30, 58, 138, 0.92) 100%);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse at center, black 25%, transparent 75%);
    -webkit-mask-image: radial-gradient(ellipse at center, black 25%, transparent 75%);
  }
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const Content = styled(motion.div)`
  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--color-secondary-300);
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 1rem;
  }
  h2 { color: white; margin-bottom: 1rem; }
  p { color: rgba(255,255,255,0.8); font-size: 1.075rem; }
`;

const Chapters = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Chapter = styled(motion.div)`
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;

  .top {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--color-accent-400);
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 700;
    margin-bottom: 0.6rem;
  }
  .name {
    color: white;
    font-family: var(--font-heading);
    font-size: 1.15rem;
    font-weight: 700;
    margin-bottom: 0.6rem;
  }
  .cities {
    color: rgba(255,255,255,0.65);
    font-size: 0.88rem;
  }

  &:hover {
    background: rgba(255,255,255,0.1);
    border-color: rgba(20, 184, 166, 0.4);
    transform: translateY(-3px);
  }
`;

export const AlumniNetwork = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });
  const { data: chaptersData = [] } = useChapters();
  const CHAPTERS = chaptersData as Chapter[];

  return (
    <Wrap>
      <div className="bg-image">
        <img src="/a49deaed21eaa32bb4fb5fc79a17b6aa.jpg" alt="" aria-hidden="true" />
      </div>
      <Container ref={ref}>
        <Content
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="eyebrow"><Globe2 size={14} /> Global Network</span>
          <h2>Alumni & Supporters Across the World</h2>
          <p>
            AYAA operates through chapters in the United States, Mekelle, and Addis Ababa.
            Together, we mobilize technical, financial, and material support to improve education
            at our former school.
          </p>
        </Content>
        <Chapters>
          {CHAPTERS.map((c, i) => (
            <Chapter
              key={c.name}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
            >
              <div className="top"><MapPin size={12} /> Chapter</div>
              <div className="name">{c.name}</div>
              <div className="cities">{c.cities.join(' Â· ')}</div>
            </Chapter>
          ))}
        </Chapters>
      </Container>
    </Wrap>
  );
};
