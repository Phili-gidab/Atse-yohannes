import { useState } from 'react';
import styled from '@emotion/styled';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  Briefcase,
  Newspaper,
  Calendar,
  Users,
  Globe2,
  HeartHandshake,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  ClipboardCheck,
  Heart,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Wrap = styled.div`
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
  background: var(--color-neutral-50);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Scrim = styled.button<{ $open: boolean }>`
  display: none;
  @media (max-width: 900px) {
    display: ${({ $open }) => ($open ? 'block' : 'none')};
    position: fixed;
    inset: 0;
    z-index: 99;
    background: rgba(0, 0, 0, 0.45);
    border: none;
    cursor: pointer;
  }
`;

const Sidebar = styled.aside<{ $open: boolean }>`
  background: linear-gradient(180deg, var(--color-primary-950), var(--color-primary-900));
  color: white;
  padding: 1.5rem 1rem;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  @media (max-width: 900px) {
    position: fixed;
    inset: 0 auto 0 0;
    width: 280px;
    z-index: 100;
    transform: translateX(${({ $open }) => ($open ? '0' : '-100%')});
    transition: transform 0.3s ease;
    box-shadow: ${({ $open }) => ($open ? '0 0 40px rgba(0,0,0,0.4)' : 'none')};
  }
`;

const Brand = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  color: white;
  text-decoration: none;
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 1.15rem;
  padding: 0.5rem 0.75rem 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  margin-bottom: 1rem;

  .dot {
    width: 32px; height: 32px; border-radius: 9px;
    background: linear-gradient(135deg, var(--color-accent-400), var(--color-accent-600));
    color: var(--color-primary-950);
    display: inline-grid; place-items: center;
    font-weight: 800;
  }
`;

const NavGroupTitle = styled.div`
  color: rgba(255,255,255,0.45);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  font-weight: 700;
  padding: 1rem 0.85rem 0.45rem;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.65rem 0.85rem;
  border-radius: 10px;
  color: rgba(255,255,255,0.78);
  text-decoration: none;
  font-size: 0.92rem;
  font-weight: 500;
  transition: all 0.2s ease;

  svg { flex-shrink: 0; opacity: 0.85; }

  &:hover {
    background: rgba(255,255,255,0.06);
    color: white;
  }

  &.active {
    background: rgba(245, 183, 29, 0.14);
    color: var(--color-accent-300);
    border: 1px solid rgba(245, 183, 29, 0.25);
    svg { opacity: 1; }
  }
`;

const Footer = styled.div`
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid rgba(255,255,255,0.08);
  display: grid;
  gap: 0.5rem;

  .who {
    padding: 0.55rem 0.85rem;
    .name { color: white; font-weight: 600; font-size: 0.92rem; }
    .role {
      color: var(--color-accent-300);
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      font-weight: 700;
      margin-top: 2px;
    }
  }

  button {
    background: transparent;
    border: 1px solid rgba(255,255,255,0.14);
    color: rgba(255,255,255,0.85);
    padding: 0.6rem 0.85rem;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 0.55rem;
    font-size: 0.88rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;

    &:hover {
      background: rgba(255,255,255,0.06);
      color: white;
      border-color: rgba(255,255,255,0.28);
    }
  }
`;

const Main = styled.main`
  padding: 2rem 2.5rem 4rem;

  @media (max-width: 900px) {
    padding: 1.25rem 1rem 3rem;
  }
`;

const TopBar = styled.div`
  display: none;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;

  @media (max-width: 900px) {
    display: flex;
  }

  button {
    background: white;
    border: 1px solid var(--color-neutral-200);
    border-radius: 10px;
    padding: 0.55rem 0.7rem;
    cursor: pointer;
  }
`;

const ContentNav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/hero', label: 'Hero', icon: Sparkles },
  { to: '/admin/programs', label: 'Programs', icon: HeartHandshake },
  { to: '/admin/projects', label: 'Projects', icon: Briefcase },
  { to: '/admin/news', label: 'News & Updates', icon: Newspaper },
  { to: '/admin/events', label: 'Events', icon: Calendar },
  { to: '/admin/leadership', label: 'Leadership', icon: Users },
  { to: '/admin/chapters', label: 'Chapters', icon: Globe2 },
  { to: '/admin/resources', label: 'Resources', icon: BookOpen },
  { to: '/admin/donationTiers', label: 'Donation Tiers', icon: Heart },
  { to: '/admin/impactMetrics', label: 'Impact Metrics', icon: TrendingUp },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

const PeopleNav = [
  { to: '/admin/applications', label: 'Applications', icon: ClipboardCheck },
  { to: '/admin/members', label: 'Members', icon: Users },
  { to: '/admin/rsvps', label: 'Event RSVPs', icon: Calendar },
  { to: '/admin/inbox', label: 'Inbox', icon: Newspaper },
];

export const AdminLayout = () => {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <Wrap>
      <Scrim $open={open} onClick={() => setOpen(false)} aria-label="Close menu" />
      <Sidebar $open={open}>
        <Brand to="/admin" onClick={() => setOpen(false)}>
          <span className="dot">A</span>
          AYAA Admin
        </Brand>

        <NavGroupTitle>Content</NavGroupTitle>
        {ContentNav.map((item) => {
          const Icon = item.icon;
          return (
            <NavItem
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
            >
              <Icon size={17} />
              {item.label}
            </NavItem>
          );
        })}

        <NavGroupTitle>People</NavGroupTitle>
        {PeopleNav.map((item) => {
          const Icon = item.icon;
          return (
            <NavItem key={item.to} to={item.to} onClick={() => setOpen(false)}>
              <Icon size={17} />
              {item.label}
            </NavItem>
          );
        })}

        <NavGroupTitle>Site</NavGroupTitle>
        <NavItem to="/" end onClick={() => setOpen(false)}>
          <Home size={17} /> View Public Site
        </NavItem>

        <Footer>
          {user && (
            <div className="who">
              <div className="name">{user.displayName ?? user.email}</div>
              <div className="role">{user.role}</div>
            </div>
          )}
          <button onClick={handleLogout}>
            <LogOut size={16} /> Sign out
          </button>
        </Footer>
      </Sidebar>

      <Main>
        <TopBar>
          <button onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div style={{ fontWeight: 700, color: 'var(--color-primary-900)' }}>
            AYAA Admin
          </div>
        </TopBar>
        <Outlet />
      </Main>
    </Wrap>
  );
};
