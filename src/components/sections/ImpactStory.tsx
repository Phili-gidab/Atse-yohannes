import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Quote } from 'lucide-react';
import { Button } from '../ui/Button';
import { useStory } from '../../hooks/useContent';

const Wrap = styled.section`
  padding: 6rem 0;
  background: white;
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
    gap: 2.5rem;
  }
`;

const ImageWrap = styled(motion.div)`
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  aspect-ratio: 4 / 5;
  box-shadow: var(--shadow-premium);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 50%, rgba(10, 37, 64, 0.4) 100%);
  }

  .quote-mark {
    position: absolute;
    top: -20px;
    left: -20px;
    width: 64px;
    height: 64px;
    border-radius: 16px;
    background: var(--color-accent-500);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow-xl);
  }
`;

const Content = styled(motion.div)`
  .eyebrow {
    display: inline-block;
    color: var(--color-secondary-600);
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 1rem;
  }
  h2 { margin-bottom: 1.5rem; }
  .body {
    font-size: 1.15rem;
    color: var(--color-neutral-700);
    line-height: 1.7;
    margin-bottom: 1.5rem;
  }
  .attribution {
    color: var(--color-neutral-500);
    font-style: italic;
    margin-bottom: 2rem;
    font-size: 0.95rem;
  }
`;

export const ImpactStory = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { data: STORY } = useStory();
  if (!STORY) return null;

  return (
    <Wrap>
      <Container ref={ref}>
        <ImageWrap
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <img src={STORY.image} alt={STORY.title} loading="lazy" />
          <span className="quote-mark"><Quote size={28} /></span>
        </ImageWrap>
        <Content
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="eyebrow">{STORY.eyebrow}</span>
          <h2>{STORY.title}</h2>
          <p className="body">{STORY.body}</p>
          <div className="attribution">— {STORY.attribution}</div>
          <Button to="/impact" variant="primary">Read More Impact Stories</Button>
        </Content>
      </Container>
    </Wrap>
  );
};
