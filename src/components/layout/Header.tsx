import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useOrg } from '../../hooks/useContent';
import { useAuth } from '../../hooks/useAuth';

interface OrgShape {
  emails: string[];
  social: { facebook: string; twitter: string; linkedin: string; youtube: string };
}

const TopBar = styled.div`
  background: var(--color-primary-950);
  padding: 0.5rem 0;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.85);

  @media (max-width: 900px) {
    display: none;
  }
`;

const TopBarContainer = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TopBarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
`;

const TopBarLink = styled(Link)`
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.2s ease;
  font-weight: 500;

  &:hover { color: var(--color-accent-400); }
`;

const TopBarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
`;

const TopBarContact = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg { color: var(--color-accent-400); }

  a {
    color: rgba(255, 255, 255, 0.85);
    text-decoration: none;
    &:hover { color: var(--color-accent-400); }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding-left: 1rem;
  border-left: 1px solid rgba(255, 255, 255, 0.18);
`;

const SocialLink = styled.a`
  color: rgba(255, 255, 255, 0.7);
  display: inline-flex;
  align-items: center;
  &:hover { color: var(--color-accent-400); }
`;

const HeaderWrapper = styled.header<{ $scrolled: boolean }>`
  position: fixed;
  top: ${({ $scrolled }) => ($scrolled ? '0' : '36px')};
  left: 0;
  right: 0;
  z-index: 100;
  transition: all 0.3s ease;
  background: ${({ $scrolled }) =>
    $scrolled ? 'white' : 'rgba(30, 58, 138, 0.95)'};
  backdrop-filter: blur(8px);
  box-shadow: ${({ $scrolled }) =>
    $scrolled ? '0 2px 20px rgba(0, 0, 0, 0.08)' : 'none'};

  @media (max-width: 900px) {
    top: 0;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--container-padding);
  max-width: var(--container-max);
  margin: 0 auto;
  height: 72px;
`;

const Logo = styled(Link)<{ $scrolled: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  text-decoration: none;
  color: ${({ $scrolled }) => ($scrolled ? 'var(--color-primary-900)' : 'white')};

  .logo-mark {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    overflow: hidden;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 20px rgba(30, 58, 138, 0.25);
  }
  .logo-mark img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .logo-text {
    display: flex;
    flex-direction: column;
    line-height: 1.05;
  }
  .logo-title {
    font-family: var(--font-heading);
    font-weight: 800;
    font-size: 1.2rem;
    letter-spacing: 0.5px;
  }
  .logo-sub {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    opacity: 0.85;
  }

  @media (max-width: 480px) {
    .logo-text { display: none; }
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  @media (max-width: 1024px) { display: none; }
`;

const NavList = styled.ul`
  display: flex;
  align-items: center;
  gap: 0;
  list-style: none;
`;

const NavItem = styled.li``;

const NavLink = styled(Link)<{ $scrolled: boolean; $active: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 0.85rem 0.95rem;
  font-family: var(--font-heading);
  font-size: 0.825rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: ${({ $scrolled, $active }) =>
    $active
      ? 'var(--color-secondary-600)'
      : $scrolled
      ? 'var(--color-neutral-700)'
      : 'rgba(255,255,255,0.92)'};
  text-decoration: none;
  transition: color 0.2s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
    width: ${({ $active }) => ($active ? '60%' : '0')};
    height: 2px;
    background: var(--color-accent-500);
    transition: width 0.25s ease;
    border-radius: 2px;
  }

  &:hover {
    color: ${({ $scrolled }) => ($scrolled ? 'var(--color-secondary-600)' : 'var(--color-accent-400)')};
    &::after { width: 60%; }
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  @media (max-width: 1024px) { display: none; }
`;

const MobileToggle = styled.button<{ $scrolled: boolean }>`
  display: none;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: ${({ $scrolled }) =>
    $scrolled ? 'var(--color-neutral-100)' : 'rgba(255,255,255,0.12)'};
  border: none;
  border-radius: 10px;
  color: ${({ $scrolled }) => ($scrolled ? 'var(--color-primary-900)' : 'white')};
  cursor: pointer;

  @media (max-width: 1024px) { display: flex; }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: white;
  z-index: 99;
  padding: 6rem 1.5rem 2rem;
  overflow-y: auto;
`;

const MobileNavList = styled.ul`
  list-style: none;
`;

const MobileNavItem = styled.li`
  border-bottom: 1px solid var(--color-neutral-100);
`;

const MobileNavLink = styled(Link)<{ $active: boolean }>`
  display: block;
  padding: 1rem 0;
  font-family: var(--font-heading);
  font-size: 1.05rem;
  font-weight: 600;
  color: ${({ $active }) => ($active ? 'var(--color-secondary-600)' : 'var(--color-primary-900)')};
  text-decoration: none;
`;

const MobileActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Impact', href: '/impact' },
  { label: 'Resources', href: '/resources' },
  { label: 'Events', href: '/events' },
  { label: 'Past Events', href: '/past-events' },
  { label: 'News', href: '/news' },
  { label: 'Contact', href: '/contact' },
];

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { data: orgData } = useOrg();
  const ORG: OrgShape = (orgData ?? { emails: [''], social: { facebook: '#', twitter: '#', linkedin: '#', youtube: '#' } }) as OrgShape;
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <TopBar>
        <TopBarContainer>
          <TopBarLeft>
            <TopBarLink to="/about">About AYAA</TopBarLink>
            <TopBarLink to="/resources">Student Resources</TopBarLink>
            <TopBarLink to="/get-involved">Get Involved</TopBarLink>
          </TopBarLeft>
          <TopBarRight>
            <TopBarContact>
              <Mail size={14} />
              <a href={`mailto:${ORG.emails[0]}`}>{ORG.emails[0]}</a>
            </TopBarContact>
            <SocialLinks>
              <SocialLink href={ORG.social.facebook} target="_blank" rel="noreferrer"><Facebook size={14} /></SocialLink>
              <SocialLink href={ORG.social.twitter} target="_blank" rel="noreferrer"><Twitter size={14} /></SocialLink>
              <SocialLink href={ORG.social.linkedin} target="_blank" rel="noreferrer"><Linkedin size={14} /></SocialLink>
              <SocialLink href={ORG.social.youtube} target="_blank" rel="noreferrer"><Youtube size={14} /></SocialLink>
            </SocialLinks>
          </TopBarRight>
        </TopBarContainer>
      </TopBar>

      <HeaderWrapper $scrolled={scrolled}>
        <HeaderContainer>
          <Logo to="/" $scrolled={scrolled}>
            <span className="logo-mark">
              <img src="/ATAA_logo.jpg" alt="AYAA logo" />
            </span>
            <span className="logo-text">
              <span className="logo-title">AYAA</span>
              <span className="logo-sub">Atse Yohannes Alumni</span>
            </span>
          </Logo>

          <Nav>
            <NavList>
              {NAV_ITEMS.map((item) => (
                <NavItem key={item.href}>
                  <NavLink
                    to={item.href}
                    $scrolled={scrolled}
                    $active={location.pathname === item.href}
                  >
                    {item.label}
                  </NavLink>
                </NavItem>
              ))}
            </NavList>
          </Nav>

          <HeaderActions>
            <Button to={user ? '/portal' : '/portal/login'} variant={scrolled ? 'outline' : 'ghost'} size="sm">
              <span style={{ color: scrolled ? undefined : 'white' }}>{user ? 'Portal' : 'Sign in'}</span>
            </Button>
            <Button to="/donate" variant="gold" size="sm">Donate Now</Button>
          </HeaderActions>

          <MobileToggle
            $scrolled={scrolled}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </MobileToggle>
        </HeaderContainer>
      </HeaderWrapper>

      <AnimatePresence>
        {mobileOpen && (
          <MobileMenu
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3 }}
          >
            <MobileNavList>
              {NAV_ITEMS.map((item) => (
                <MobileNavItem key={item.href}>
                  <MobileNavLink to={item.href} $active={location.pathname === item.href}>
                    {item.label}
                  </MobileNavLink>
                </MobileNavItem>
              ))}
            </MobileNavList>
            <MobileActions>
              <Button to="/get-involved" variant="outline" fullWidth>Join the Network</Button>
              <Button to="/donate" variant="gold" fullWidth>Donate Now</Button>
            </MobileActions>
          </MobileMenu>
        )}
      </AnimatePresence>
    </>
  );
};
