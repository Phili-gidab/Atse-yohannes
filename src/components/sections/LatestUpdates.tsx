import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useNews } from '../../hooks/useContent';

interface NewsItem {
  slug: string;
  date: string;
  category: string;
  title: string;
  excerpt: string;
  image: string;
}

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
  display: flex;
  justify-content: space-between;
  align-items: end;
  margin-bottom: 3rem;
  gap: 2rem;
  flex-wrap: wrap;

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
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const Card = styled(motion(Link))`
  background: white;
  border-radius: 18px;
  overflow: hidden;
  text-decoration: none;
  display: block;
  border: 1px solid var(--color-neutral-200);
  transition: all 0.3s ease;

  .image {
    aspect-ratio: 16 / 10;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
  }

  .body {
    padding: 1.5rem;
  }
  .meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.78rem;
    color: var(--color-neutral-500);
    margin-bottom: 0.75rem;

    .cat {
      padding: 0.25rem 0.6rem;
      background: var(--color-secondary-50);
      color: var(--color-secondary-700);
      border-radius: 999px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }
    .date {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
  }
  h3 {
    font-size: 1.1rem;
    color: var(--color-primary-900);
    margin-bottom: 0.5rem;
    line-height: 1.35;
  }
  p {
    color: var(--color-neutral-600);
    font-size: 0.92rem;
    line-height: 1.55;
    margin-bottom: 1rem;
  }
  .read {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--color-secondary-700);
    transition: gap 0.25s ease;
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-xl);
    border-color: var(--color-secondary-300);

    .image img { transform: scale(1.05); }
    .read { gap: 10px; }
  }
`;

const fmt = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export const LatestUpdates = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { data: news = [] } = useNews();
  const NEWS = (news as NewsItem[]).slice(0, 3);

  return (
    <Wrap>
      <Container>
        <Header>
          <div>
            <span className="eyebrow">News & Updates</span>
            <h2>What's Happening at AYAA</h2>
            <p>Recent fundraising milestones, project updates, and stories from our alumni.</p>
          </div>
          <Button to="/news" variant="outline">All Updates <ArrowRight size={16} /></Button>
        </Header>
        <Grid ref={ref}>
          {NEWS.map((n, i) => (
            <Card
              key={n.slug}
              to="/news"
              initial={{ opacity: 0, y: 22 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div className="image"><img src={n.image} alt={n.title} loading="lazy" /></div>
              <div className="body">
                <div className="meta">
                  <span className="cat">{n.category}</span>
                  <span className="date"><Calendar size={12} /> {fmt(n.date)}</span>
                </div>
                <h3>{n.title}</h3>
                <p>{n.excerpt}</p>
                <span className="read">Read story <ArrowRight size={14} /></span>
              </div>
            </Card>
          ))}
        </Grid>
      </Container>
    </Wrap>
  );
};
