import { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { PageHero } from '../components/sections/PageHero';
import { Button } from '../components/ui/Button';
import { useEvents } from '../hooks/useContent';
import { RsvpModal } from '../components/events/RsvpModal';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

interface EventItem {
  slug: string;
  date: string;
  title: string;
  location: string;
  description: string;
  type: string;
}

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
  gap: 1.25rem;
`;

const Event = styled(motion.div)`
  background: white;
  border-radius: 18px;
  padding: 1.75rem;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 2rem;
  align-items: center;
  border: 1px solid var(--color-neutral-200);
  transition: all 0.3s ease;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    text-align: left;
  }

  .date-badge {
    width: 80px;
    text-align: center;
    padding: 0.75rem 0;
    background: linear-gradient(135deg, var(--color-primary-800), var(--color-primary-950));
    color: white;
    border-radius: 12px;

    .day {
      font-family: var(--font-heading);
      font-size: 1.75rem;
      font-weight: 800;
      line-height: 1;
    }
    .month {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: var(--color-accent-400);
      margin-top: 0.25rem;
    }

    @media (max-width: 800px) {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.6rem;

      .day { font-size: 1rem; }
      .month { margin-top: 0; }
    }
  }

  .body {
    .type {
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--color-secondary-700);
      font-weight: 700;
      margin-bottom: 0.4rem;
    }
    h3 { color: var(--color-primary-900); margin-bottom: 0.4rem; font-size: 1.2rem; }
    p { color: var(--color-neutral-600); font-size: 0.95rem; margin-bottom: 0.6rem; }
    .meta {
      display: flex;
      align-items: center;
      gap: 1rem;
      color: var(--color-neutral-500);
      font-size: 0.85rem;
      flex-wrap: wrap;

      span { display: inline-flex; align-items: center; gap: 4px; }
    }
  }

  &:hover {
    border-color: var(--color-secondary-400);
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
  }
`;

const fmtMonth = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
const fmtDay = (d: string) => new Date(d).getDate();
const fmtFull = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

export const Events = () => {
  useDocumentTitle('Events', 'Annual reunions, regional fundraisers, and community events.');
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });
  const { data: eventsData = [] } = useEvents();
  const EVENTS = eventsData as EventItem[];
  const [rsvpFor, setRsvpFor] = useState<EventItem | null>(null);

  return (
    <>
      <PageHero
        eyebrow="Events & Reunions"
        title="Where the Network Comes Together"
        subtitle="From annual reunions to regional fundraisers — these are the moments where the AYAA community connects, celebrates, and gives back."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Events' }]}
      />
      <Section>
        <Container>
          <List ref={ref}>
            {EVENTS.map((e, i) => (
              <Event
                key={e.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.07 }}
              >
                <div className="date-badge">
                  <div className="day">{fmtDay(e.date)}</div>
                  <div className="month">{fmtMonth(e.date)}</div>
                </div>
                <div className="body">
                  <div className="type">{e.type}</div>
                  <h3>{e.title}</h3>
                  <p>{e.description}</p>
                  <div className="meta">
                    <span><Calendar size={14} /> {fmtFull(e.date)}</span>
                    <span><MapPin size={14} /> {e.location}</span>
                  </div>
                </div>
                <Button variant="primary" size="sm" onClick={() => setRsvpFor(e)}>
                  RSVP <ArrowRight size={14} />
                </Button>
              </Event>
            ))}
          </List>
        </Container>
      </Section>

      {rsvpFor && (
        <RsvpModal
          eventSlug={rsvpFor.slug}
          eventTitle={rsvpFor.title}
          onClose={() => setRsvpFor(null)}
        />
      )}
    </>
  );
};
