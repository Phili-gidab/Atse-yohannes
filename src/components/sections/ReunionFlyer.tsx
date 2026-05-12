import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight, ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEvents } from '../../hooks/useContent';

interface EventItem {
  slug: string;
  title: string;
  date: string;
  location: string;
  description: string;
  type: string;
  flyerImage?: string;
}

// Featured AYAA reunion banner. Shows the next reunion-type event with either
// the uploaded flyer image OR a clearly-marked "flyer coming soon" placeholder
// so the homepage section is reserved until AYAA sends the artwork.
const Wrap = styled.section`
  background:
    radial-gradient(circle at 10% 20%, rgba(245, 183, 29, 0.12), transparent 55%),
    radial-gradient(circle at 90% 80%, rgba(20, 184, 166, 0.10), transparent 55%),
    linear-gradient(135deg, var(--color-primary-950), var(--color-primary-900));
  padding: 4rem 0;
  color: white;
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  gap: 2.5rem;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 1.75rem;
  }
`;

const FlyerSlot = styled(motion.div)`
  position: relative;
  aspect-ratio: 4 / 5;
  border-radius: 18px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.06);
  border: 2px dashed rgba(255, 255, 255, 0.22);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1.5rem;

  &.has-image {
    border-style: solid;
    border-color: rgba(255, 255, 255, 0.18);
    background: rgba(0, 0, 0, 0.25);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    color: rgba(255, 255, 255, 0.7);

    .icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.08);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--color-accent-400);
    }
    strong {
      color: white;
      font-family: var(--font-heading);
      font-size: 1rem;
      letter-spacing: 0.4px;
    }
    span {
      font-size: 0.85rem;
      max-width: 24ch;
      line-height: 1.5;
    }
  }
`;

const Body = styled(motion.div)`
  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--color-accent-300);
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.4px;
    margin-bottom: 0.85rem;
  }

  h2 {
    color: white;
    font-size: clamp(1.7rem, 3.4vw, 2.6rem);
    line-height: 1.15;
    margin-bottom: 1rem;
  }

  p {
    color: rgba(255, 255, 255, 0.82);
    font-size: 1.02rem;
    line-height: 1.7;
    margin-bottom: 1.5rem;
    max-width: 56ch;
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 1.75rem;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.55rem 0.95rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.14);
    color: rgba(255, 255, 255, 0.92);
    font-size: 0.82rem;
    font-weight: 600;

    svg { color: var(--color-accent-400); }
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .cta-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.85rem 1.5rem;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--color-accent-400), var(--color-accent-600));
    color: var(--color-primary-950);
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: 0.92rem;
    letter-spacing: 0.4px;
    text-decoration: none;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 28px rgba(245, 183, 29, 0.35);
    }
  }

  .cta-secondary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.85rem 1.4rem;
    border-radius: 10px;
    border: 1.5px solid rgba(255, 255, 255, 0.32);
    color: white;
    font-family: var(--font-heading);
    font-weight: 600;
    font-size: 0.9rem;
    text-decoration: none;
    transition: background 0.2s ease, border-color 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.55);
    }
  }
`;

const formatDate = (iso: string) => {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  } catch {
    return iso;
  }
};

export const ReunionFlyer = () => {
  const { data: events = [] } = useEvents();
  const today = new Date();
  // Pick the next upcoming reunion (or any upcoming event if there's no
  // reunion). Falls back to nothing if every event has passed.
  const upcoming = (events as EventItem[])
    .filter((e) => new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const reunion = upcoming.find((e) => e.type === 'Reunion') ?? upcoming[0];

  if (!reunion) return null;

  return (
    <Wrap aria-label="Upcoming AYAA reunion">
      <Container>
        <FlyerSlot
          className={reunion.flyerImage ? 'has-image' : ''}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          {reunion.flyerImage ? (
            <img src={reunion.flyerImage} alt={`${reunion.title} flyer`} />
          ) : (
            <div className="placeholder">
              <span className="icon"><ImageIcon size={26} /></span>
              <strong>Flyer coming soon</strong>
              <span>The official AYAA reunion flyer will be posted here shortly.</span>
            </div>
          )}
        </FlyerSlot>

        <Body
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="eyebrow"><Calendar size={14} /> Upcoming AYAA Event</span>
          <h2>{reunion.title}</h2>
          <p>{reunion.description}</p>
          <div className="meta">
            <span className="chip"><Calendar size={14} /> {formatDate(reunion.date)}</span>
            <span className="chip"><MapPin size={14} /> {reunion.location}</span>
          </div>
          <div className="actions">
            <Link to={`/events#${reunion.slug}`} className="cta-primary">
              RSVP & Details <ArrowRight size={16} />
            </Link>
            <Link to="/events" className="cta-secondary">
              All upcoming events
            </Link>
          </div>
        </Body>
      </Container>
    </Wrap>
  );
};
