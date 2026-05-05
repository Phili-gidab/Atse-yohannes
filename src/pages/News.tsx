import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHero } from '../components/sections/PageHero';
import { useNews } from '../hooks/useContent';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

interface NewsItem {
  slug: string;
  date: string;
  category: string;
  title: string;
  excerpt: string;
  image: string;
}

const Section = styled.section`
  padding: 5rem 0;
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const Featured = styled(motion(Link))`
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 0;
  background: white;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: var(--shadow-md);
  margin-bottom: 3rem;
  text-decoration: none;
  transition: all 0.3s ease;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }

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
    padding: 2.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;

    @media (max-width: 700px) { padding: 1.5rem; }

    .meta {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;

      .cat {
        background: var(--color-accent-100);
        color: var(--color-accent-800);
        padding: 0.3rem 0.7rem;
        border-radius: 999px;
        font-size: 0.72rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .date {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        color: var(--color-neutral-500);
        font-size: 0.85rem;
      }
    }
    h2 { color: var(--color-primary-900); font-size: clamp(1.35rem, 4vw, 1.85rem); margin-bottom: 1rem; line-height: 1.25; }
    p { color: var(--color-neutral-600); font-size: 1.025rem; line-height: 1.65; margin-bottom: 1.5rem; }
    .read {
      color: var(--color-secondary-700);
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
    .image img { transform: scale(1.04); }
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 700px) { grid-template-columns: 1fr; }
`;

const Card = styled(motion(Link))`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  text-decoration: none;
  border: 1px solid var(--color-neutral-200);
  transition: all 0.3s ease;
  display: grid;
  grid-template-columns: 0.4fr 0.6fr;

  .image { aspect-ratio: 4 / 3; }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    .image { aspect-ratio: 16 / 9; }
  }

  .image {
    overflow: hidden;
    img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
  }
  .body {
    padding: 1.5rem;

    .meta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: var(--color-neutral-500);
      margin-bottom: 0.5rem;

      .cat {
        background: var(--color-secondary-50);
        color: var(--color-secondary-700);
        padding: 0.2rem 0.55rem;
        border-radius: 999px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }
    h3 {
      color: var(--color-primary-900);
      font-size: 1.05rem;
      line-height: 1.35;
      margin-bottom: 0.5rem;
    }
    p {
      color: var(--color-neutral-600);
      font-size: 0.88rem;
      line-height: 1.5;
    }
  }

  &:hover {
    border-color: var(--color-secondary-300);
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
    .image img { transform: scale(1.06); }
  }
`;

const fmt = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export const News = () => {
  useDocumentTitle('News & Updates', 'Fundraising milestones, project progress, and stories from the AYAA community.');
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });
  const { data: newsData = [] } = useNews();
  const NEWS = newsData as NewsItem[];
  const [feat, ...rest] = NEWS;
  if (!feat) return null;

  return (
    <>
      <PageHero
        eyebrow="News & Updates"
        title="Stories from AYAA"
        subtitle="Fundraising milestones, project progress, alumni contributions, and updates from Atse Yohannes School."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'News' }]}
      />
      <Section>
        <Container>
          <Featured
            to="/news"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55 }}
          >
            <div className="image"><img src={feat.image} alt={feat.title} loading="lazy" /></div>
            <div className="body">
              <div className="meta">
                <span className="cat">{feat.category}</span>
                <span className="date"><Calendar size={12} /> {fmt(feat.date)}</span>
              </div>
              <h2>{feat.title}</h2>
              <p>{feat.excerpt}</p>
              <span className="read">Read full story <ArrowRight size={14} /></span>
            </div>
          </Featured>

          <Grid ref={ref}>
            {rest.map((n, i) => (
              <Card
                key={n.slug}
                to="/news"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div className="image"><img src={n.image} alt={n.title} loading="lazy" /></div>
                <div className="body">
                  <div className="meta">
                    <span className="cat">{n.category}</span>
                    <span><Calendar size={12} /> {fmt(n.date)}</span>
                  </div>
                  <h3>{n.title}</h3>
                  <p>{n.excerpt}</p>
                </div>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>
    </>
  );
};
