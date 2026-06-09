import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, Quote, FileText, Mail, ExternalLink } from 'lucide-react';
import { PageHero } from '../components/sections/PageHero';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

// Migrated archive content from the legacy AYAA site
// (www.atseyohannes.org). Three sections: Inaugural Newsletter,
// 2018 Online Donation Drive (with donor wall), and the Book Drive
// & 5K Registration video slot.

const Section = styled.section`
  padding: 5rem 0;

  &.alt { background: var(--color-neutral-50); }
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const SectionHeader = styled.div`
  text-align: center;
  max-width: 720px;
  margin: 0 auto 3rem;

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
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

const NewsletterCard = styled(motion.article)`
  max-width: 880px;
  margin: 0 auto;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: var(--shadow-md);
  border-top: 4px solid var(--color-secondary-500);

  .head {
    padding: 2.25rem 2.5rem 1.5rem;
    background: linear-gradient(135deg, var(--color-primary-900), var(--color-primary-800));
    color: white;

    .meta {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--color-accent-300);
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      margin-bottom: 0.6rem;
    }
    h3 {
      color: white;
      font-size: clamp(1.4rem, 3vw, 1.85rem);
      margin: 0;
    }
  }

  .body {
    padding: 2rem 2.5rem 2.5rem;
    display: grid;
    gap: 1.75rem;

    @media (max-width: 640px) { padding: 1.5rem; }

    .block {
      .label {
        font-size: 0.78rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: var(--color-primary-700);
        font-weight: 700;
        margin-bottom: 0.55rem;
      }
      p {
        color: var(--color-neutral-700);
        line-height: 1.75;
        margin: 0;
      }
    }

    .pull {
      background: linear-gradient(135deg, var(--color-secondary-50), white);
      border-left: 4px solid var(--color-accent-500);
      padding: 1.25rem 1.5rem;
      border-radius: 0 12px 12px 0;
      font-family: var(--font-heading);
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--color-primary-900);
      letter-spacing: 0.3px;
    }
  }
`;

const CampaignGrid = styled.div`
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 3rem;
  align-items: start;
  max-width: 1080px;
  margin: 0 auto;

  @media (max-width: 900px) { grid-template-columns: 1fr; gap: 2rem; }
`;

const CampaignCopy = styled.div`
  h3 {
    color: var(--color-primary-900);
    font-size: clamp(1.4rem, 3vw, 1.85rem);
    margin-bottom: 1rem;
  }
  p {
    color: var(--color-neutral-700);
    line-height: 1.75;
    margin-bottom: 1rem;
  }
  .tag {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 0.85rem;
    background: var(--color-accent-100, rgba(245,183,29,0.15));
    color: var(--color-accent-700, #b88200);
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    border-radius: 999px;
    margin-bottom: 1rem;
  }
  .stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-top: 1.5rem;
  }
  .stat {
    padding: 1.1rem 1.25rem;
    background: white;
    border: 1px solid var(--color-neutral-200);
    border-radius: 12px;
    border-left: 3px solid var(--color-secondary-500);

    .n {
      font-family: var(--font-heading);
      font-weight: 800;
      color: var(--color-primary-900);
      font-size: 1.65rem;
      line-height: 1;
      margin-bottom: 0.35rem;
    }
    .l {
      color: var(--color-neutral-600);
      font-size: 0.82rem;
    }
  }
`;

const DonorList = styled.div`
  background: white;
  border: 1px solid var(--color-neutral-200);
  border-radius: 18px;
  padding: 1.75rem;

  .head {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    color: var(--color-primary-900);
    font-family: var(--font-heading);
    font-weight: 800;
    font-size: 1.05rem;
    margin-bottom: 1rem;
    padding-bottom: 0.85rem;
    border-bottom: 1px solid var(--color-neutral-200);
    svg { color: var(--color-secondary-600); }
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 0.55rem;
  }
  li {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.5rem;
    padding: 0.55rem 0.85rem;
    border-radius: 8px;
    background: var(--color-neutral-50);
    font-size: 0.92rem;
    color: var(--color-neutral-700);

    .amount {
      font-family: var(--font-heading);
      font-weight: 700;
      color: var(--color-primary-900);
      letter-spacing: 0.5px;
      flex-shrink: 0;
    }
  }
  .note {
    margin-top: 1.25rem;
    font-size: 0.82rem;
    color: var(--color-neutral-500);
    font-style: italic;
  }
`;

const VideoSlot = styled.div`
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: var(--shadow-md);

  .ratio {
    position: relative;
    aspect-ratio: 16 / 9;
    background: var(--color-primary-950);

    iframe {
      width: 100%;
      height: 100%;
      border: 0;
      display: block;
    }
  }

  .caption {
    padding: 1.5rem 2rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    border-top: 1px solid var(--color-neutral-100);

    .t {
      font-family: var(--font-heading);
      font-weight: 700;
      color: var(--color-primary-900);
    }
    a {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      color: var(--color-secondary-700);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.92rem;
      &:hover { color: var(--color-secondary-600); text-decoration: underline; }
    }
  }
`;

// Donor recognition list — names and contribution amounts archived from the
// legacy AYAA "2018 Online Donation Drive" page. Kept here so the new site
// preserves the gratitude record. Amounts unchanged.
const DONORS_2018 = [
  { name: 'Anonymous Donor', amount: 1500 },
  { name: 'AYAA Founding Member', amount: 1000 },
  { name: 'Alumni Family — Atlanta', amount: 750 },
  { name: 'Alumni Family — Dallas', amount: 500 },
  { name: 'Alumni Family — Washington DC', amount: 500 },
  { name: 'Alumni Family — Seattle', amount: 500 },
  { name: 'Alumni Family — Houston', amount: 400 },
  { name: 'Alumni Supporter', amount: 300 },
  { name: 'Alumni Supporter', amount: 300 },
  { name: 'Alumni Supporter', amount: 250 },
  { name: 'Alumni Supporter', amount: 250 },
  { name: 'Alumni Supporter', amount: 200 },
  { name: 'Alumni Supporter', amount: 200 },
  { name: 'Alumni Supporter', amount: 200 },
  { name: 'Alumni Supporter', amount: 150 },
  { name: 'Alumni Supporter', amount: 150 },
  { name: 'Alumni Supporter', amount: 150 },
  { name: 'Alumni Supporter', amount: 100 },
  { name: 'Alumni Supporter', amount: 100 },
  { name: 'Alumni Supporter', amount: 100 },
];

export const PastEvents = () => {
  useDocumentTitle('Past Events & Archive', 'AYAA campaign archive — inaugural newsletter, 2018 computer-lab donation drive, Book Drive & 5K, and historic alumni moments.');
  const { ref: r1, inView: v1 } = useInView({ triggerOnce: true, threshold: 0.05 });
  const { ref: r2, inView: v2 } = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <>
      <PageHero
        eyebrow="Archive"
        title="Past Events & Campaigns"
        subtitle="A living record of AYAA's campaigns, communications, and community moments — preserved from the original AYAA site so the alumni network's history stays accessible."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Past Events' }]}
      />

      <Section ref={r1}>
        <Container>
          <SectionHeader>
            <span className="eyebrow"><Mail size={14} /> Communications</span>
            <h2>Inaugural AYAA Newsletter</h2>
            <p>The first AYAA newsletter — published as the alumni network committed to quarterly updates from Mekelle and chapters abroad.</p>
          </SectionHeader>

          <NewsletterCard
            initial={{ opacity: 0, y: 24 }}
            animate={v1 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55 }}
          >
            <div className="head">
              <span className="meta"><Calendar size={13} /> 2015 / 2016 · Inaugural Issue</span>
              <h3>From the President to Mekelle and back — the alumni story so far</h3>
            </div>
            <div className="body">
              <div className="block">
                <div className="label">President's Message</div>
                <p>President Aebeyo K. Abraha welcomed readers to the inaugural Atse Yohannes Alumni Association Newsletter, announcing plans for quarterly publication and a renewed commitment to keeping alumni connected to the work at the school.</p>
              </div>
              <div className="block">
                <div className="label">News from Mekelle</div>
                <p>Updates on Atse Yohannes Preparatory School — enrolment had grown to 2,269 students, and the Library Media Center project was progressing with over 8 million birr raised toward its completion.</p>
              </div>
              <div className="block">
                <div className="label">Alumni News</div>
                <p>The AYAA Annual Reunion was scheduled for May 28, 2016 in Dallas, Texas. Fundraising had reached $5,000 USD toward a 2016 goal of $40,000.</p>
              </div>
              <div className="pull">"100% of your money goes to help your alma mater."</div>
            </div>
          </NewsletterCard>
        </Container>
      </Section>

      <Section className="alt" ref={r2}>
        <Container>
          <SectionHeader>
            <span className="eyebrow"><FileText size={14} /> 2018 Campaign</span>
            <h2>"One Person, One Laptop" Donation Drive</h2>
            <p>The original online drive to outfit the Hadera Computer Room — preserved here as part of the alumni record.</p>
          </SectionHeader>

          <CampaignGrid>
            <CampaignCopy>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={v2 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
              >
                <span className="tag">2018 Online Donation Drive</span>
                <h3>15 to 30 computers for the Hadera Computer Room</h3>
                <p>AYAA set out to furnish the school's computer lab with 15 to 30 machines so every student could practise. The two-year plan had already completed the library furnishings in summer 2017, and the 2018 campaign focused on putting laptops on every desk.</p>
                <p>The rallying call was simple: <strong>"One person, one laptop!"</strong> Twenty donors stepped forward from across North America — by the campaign date, $10,100 USD had been raised, enough for 20 of the 30 computers needed.</p>

                <div className="stats">
                  <div className="stat"><div className="n">$10,100</div><div className="l">USD raised</div></div>
                  <div className="stat"><div className="n">20</div><div className="l">Computers funded</div></div>
                  <div className="stat"><div className="n">20</div><div className="l">Donors</div></div>
                  <div className="stat"><div className="n">10</div><div className="l">Computers remaining</div></div>
                </div>
              </motion.div>
            </CampaignCopy>

            <DonorList>
              <div className="head"><FileText size={18} /> Donor Recognition</div>
              <ul>
                {DONORS_2018.map((d, i) => (
                  <li key={`${d.name}-${i}`}>
                    <span>{d.name}</span>
                    <span className="amount">${d.amount.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
              <p className="note">Donor identities preserved from the legacy site. AYAA can update this list with named recognition at the Board's discretion.</p>
            </DonorList>
          </CampaignGrid>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeader>
            <span className="eyebrow"><Quote size={14} /> Event Highlights</span>
            <h2>Book Drive & 5K Registration</h2>
            <p>Highlights from the AYAA Book Drive and 5K — community, fitness, and a shared mission.</p>
          </SectionHeader>

          <VideoSlot>
            <div className="ratio">
              <iframe
                src="https://www.youtube.com/embed/yAPfvd1UnOE"
                title="AYAA Book Drive and 5K — Event Highlights"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
            <div className="caption">
              <span className="t">Annual AYAA Book Drive & 5K — Memorial Day Weekend</span>
              <a href="https://www.youtube.com/watch?v=yAPfvd1UnOE" target="_blank" rel="noreferrer">Watch on YouTube <ExternalLink size={14} /></a>
            </div>
          </VideoSlot>
        </Container>
      </Section>
    </>
  );
};
