import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Camera, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

const PHOTOS: Array<{ src: string; alt: string; tag: string }> = [
  {
    src: '/0a1bac7e0501e2f2e22a75edf85d970e.jpg',
    alt: 'Alumni gathering at Atse Yohannes School',
    tag: 'Community',
  },
  {
    src: '/f249a1bcaf8003267d8e314ad15be36c.jpg',
    alt: 'Memorial Day 5K Run participants',
    tag: 'Fundraiser',
  },
  {
    src: '/646105fc688125e35c9eb7fd3ae258f5.jpg',
    alt: 'AYAA leadership address at school event',
    tag: 'Leadership',
  },
  {
    src: '/68f2ee741ffb2feedf27a150f6a1542f.jpg',
    alt: 'Library Media Center under construction',
    tag: 'Project',
  },
  {
    src: '/38f9f4701653c2ba8bd7f936f1ef4d46.jpg',
    alt: 'Family at the Memorial Day Run',
    tag: 'Reunion',
  },
  {
    src: '/f3a668989c3161e440ffaccdc2e6da0f.jpg',
    alt: 'Alumni applauding at school event',
    tag: 'Community',
  },
];

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
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 2rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;

  .lead {
    max-width: 640px;
  }

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 6px;
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
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: 200px;
  gap: 1rem;

  @media (max-width: 900px) {
    grid-auto-rows: 180px;
  }

  @media (max-width: 640px) {
    grid-template-columns: repeat(6, 1fr);
    grid-auto-rows: 160px;
  }
`;

const Tile = styled(motion.div)<{ $col: number; $row: number }>`
  grid-column: span ${({ $col }) => $col};
  grid-row: span ${({ $row }) => $row};
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: var(--shadow-md);
  cursor: pointer;
  isolation: isolate;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 35%, rgba(30, 58, 138, 0.78) 100%);
    opacity: 0.85;
    transition: opacity 0.35s ease;
  }

  .tag {
    position: absolute;
    top: 14px;
    left: 14px;
    z-index: 2;
    padding: 0.35rem 0.7rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.95);
    color: var(--color-primary-900);
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    backdrop-filter: blur(8px);
  }

  .caption {
    position: absolute;
    left: 16px;
    right: 16px;
    bottom: 14px;
    z-index: 2;
    color: white;
    font-size: 0.92rem;
    font-weight: 600;
    line-height: 1.35;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);
  }

  &:hover {
    img { transform: scale(1.06); }
    &::after { opacity: 1; }
  }

  @media (max-width: 640px) {
    grid-column: span 6 !important;
    grid-row: span 1 !important;
  }
`;

// 12-column layout: large hero (cols 6, rows 2), then 4 tiles spanning 3 cols each, then a wide tile
const layout: Array<{ col: number; row: number }> = [
  { col: 6, row: 2 },
  { col: 3, row: 1 },
  { col: 3, row: 1 },
  { col: 3, row: 1 },
  { col: 3, row: 1 },
  { col: 6, row: 1 },
];

export const CommunityGallery = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <Wrap>
      <Container>
        <Header>
          <div className="lead">
            <span className="eyebrow"><Camera size={14} /> Moments</span>
            <h2>The People Behind the Mission</h2>
            <p>
              Reunions, fundraisers, project visits, and the everyday community work that brings AYAA
              alive {'—'} across Mekelle, Addis Ababa, and the United States.
            </p>
          </div>
          <Button to="/news" variant="outline">
            See All Stories <ArrowRight size={16} />
          </Button>
        </Header>

        <Grid ref={ref}>
          {PHOTOS.map((p, i) => {
            const l = layout[i] ?? { col: 4, row: 1 };
            return (
              <Tile
                key={p.src}
                $col={l.col}
                $row={l.row}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.07 }}
              >
                <span className="tag">{p.tag}</span>
                <img src={p.src} alt={p.alt} loading="lazy" />
                <div className="caption">{p.alt}</div>
              </Tile>
            );
          })}
        </Grid>
      </Container>
    </Wrap>
  );
};
