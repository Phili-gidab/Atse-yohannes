import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

const Wrap = styled.section`
  padding: 9rem 0 4rem;
  background:
    radial-gradient(circle at 20% 30%, rgba(20, 184, 166, 0.18), transparent 45%),
    radial-gradient(circle at 80% 20%, rgba(245, 183, 29, 0.10), transparent 50%),
    linear-gradient(180deg, var(--color-primary-950) 0%, var(--color-primary-800) 100%);
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(circle at 50% 50%, black, transparent 75%);
  }

  @media (max-width: 700px) {
    padding-top: 7rem;
  }
`;

const Container = styled.div`
  position: relative;
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const Crumbs = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: rgba(255,255,255,0.7);
  margin-bottom: 1rem;

  a {
    color: rgba(255,255,255,0.7);
    text-decoration: none;
    &:hover { color: var(--color-accent-400); }
  }
  span.sep { opacity: 0.5; display: inline-flex; }
  span.current { color: var(--color-accent-400); font-weight: 600; }
`;

const Eyebrow = styled.span`
  display: inline-block;
  color: var(--color-secondary-300);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 0.75rem;
`;

const Title = styled.h1`
  color: white;
  font-size: clamp(2.2rem, 4.5vw, 3.4rem);
  font-weight: 800;
  margin-bottom: 0.85rem;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  color: rgba(255,255,255,0.85);
  font-size: 1.1rem;
  max-width: 70ch;
`;

export const PageHero = ({ eyebrow, title, subtitle, breadcrumbs }: PageHeroProps) => {
  return (
    <Wrap>
      <Container>
        {breadcrumbs && (
          <Crumbs>
            {breadcrumbs.map((b, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                {b.href ? <Link to={b.href}>{b.label}</Link> : <span className="current">{b.label}</span>}
                {i < breadcrumbs.length - 1 && <span className="sep"><ChevronRight size={14} /></span>}
              </span>
            ))}
          </Crumbs>
        )}
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <Title>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </Container>
    </Wrap>
  );
};
