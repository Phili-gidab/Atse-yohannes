import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { Mail, MapPin, Facebook, Twitter, Linkedin, Youtube, GraduationCap } from 'lucide-react';
import { useOrg } from '../../hooks/useContent';
import { NewsletterSignup } from '../NewsletterSignup';

interface OrgShape {
  name: string;
  location: string;
  emails: string[];
  social: { facebook: string; twitter: string; linkedin: string; youtube: string };
}

const Wrap = styled.footer`
  background: var(--color-primary-950);
  color: rgba(255, 255, 255, 0.8);
  padding: 4rem 0 1.5rem;
  margin-top: auto;

  @media (max-width: 600px) { padding: 2.5rem 0 1.25rem; }
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1fr;
  gap: 3rem;
  padding-bottom: 3rem;
  border-bottom: 1px solid rgba(255,255,255,0.08);

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    padding-bottom: 2rem;
  }
  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    gap: 1.75rem;
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 1rem;

  .mark {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--color-secondary-500), var(--color-secondary-700));
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
  .name {
    font-family: var(--font-heading);
    font-weight: 800;
    color: white;
    font-size: 1.25rem;
    letter-spacing: 0.5px;
  }
`;

const Tagline = styled.p`
  color: rgba(255,255,255,0.7);
  margin-bottom: 1.25rem;
  max-width: 38ch;
`;

const ColTitle = styled.h4`
  color: white;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 1rem;
  font-weight: 700;
`;

const ColLinks = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  a {
    color: rgba(255,255,255,0.7);
    text-decoration: none;
    transition: color 0.2s ease;
    font-size: 0.92rem;
    &:hover { color: var(--color-accent-400); }
  }
`;

const Contact = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  div {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    color: rgba(255,255,255,0.75);
    font-size: 0.92rem;
  }
  svg { color: var(--color-accent-400); flex-shrink: 0; margin-top: 2px; }
  a { color: rgba(255,255,255,0.75); text-decoration: none; &:hover { color: var(--color-accent-400); } }
`;

const Socials = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;

  a {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: rgba(255,255,255,0.06);
    color: white;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s ease, transform 0.2s ease;
    &:hover { background: var(--color-secondary-600); transform: translateY(-2px); }
  }
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  font-size: 0.85rem;
  color: rgba(255,255,255,0.55);

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
`;

export const Footer = () => {
  const { data: orgData } = useOrg();
  const ORG: OrgShape = (orgData ?? { name: 'AYAA', location: '', emails: [], social: { facebook: '#', twitter: '#', linkedin: '#', youtube: '#' } }) as OrgShape;

  return (
    <Wrap>
      <Container>
        <Grid>
          <div>
            <Brand>
              <span className="mark"><GraduationCap size={22} /></span>
              <span className="name">AYAA</span>
            </Brand>
            <Tagline>
              {ORG.name} — a global alumni network supporting students at Atse Yohannes School
              through education, infrastructure, and opportunity.
            </Tagline>
            <Socials>
              <a href={ORG.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={16} /></a>
              <a href={ORG.social.twitter} target="_blank" rel="noreferrer" aria-label="Twitter"><Twitter size={16} /></a>
              <a href={ORG.social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={16} /></a>
              <a href={ORG.social.youtube} target="_blank" rel="noreferrer" aria-label="YouTube"><Youtube size={16} /></a>
            </Socials>
          </div>

          <div>
            <ColTitle>Explore</ColTitle>
            <ColLinks>
              <li><Link to="/about">About AYAA</Link></li>
              <li><Link to="/projects">Projects</Link></li>
              <li><Link to="/impact">Our Impact</Link></li>
              <li><Link to="/news">News</Link></li>
              <li><Link to="/events">Events</Link></li>
            </ColLinks>
          </div>

          <div>
            <ColTitle>Get Involved</ColTitle>
            <ColLinks>
              <li><Link to="/donate">Donate Now</Link></li>
              <li><Link to="/get-involved">Join the Network</Link></li>
              <li><Link to="/resources">Student Resources</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ColLinks>
          </div>

          <div>
            <ColTitle>Reach Us</ColTitle>
            <Contact>
              <div>
                <MapPin size={16} />
                <span>{ORG.location}</span>
              </div>
              {ORG.emails.map((email) => (
                <div key={email}>
                  <Mail size={16} />
                  <a href={`mailto:${email}`}>{email}</a>
                </div>
              ))}
            </Contact>

            <div style={{ marginTop: '1.25rem' }}>
              <ColTitle style={{ marginBottom: '0.5rem' }}>Stay Updated</ColTitle>
              <NewsletterSignup />
            </div>
          </div>
        </Grid>

        <Bottom>
          <span>© {new Date().getFullYear()} {ORG.name}. All rights reserved.</span>
          <span>A non-profit, non-political organization.</span>
        </Bottom>
      </Container>
    </Wrap>
  );
};
