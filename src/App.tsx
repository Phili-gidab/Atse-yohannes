import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Layout } from './components/layout';
import { PageTransition } from './components/transitions';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import {
  Home,
  About,
  Projects,
  Impact,
  Resources,
  GetInvolvedPage,
  Events,
  Donate,
  News,
  Contact,
} from './pages';

// Admin routes are lazy-loaded so the public bundle stays slim. Anything
// imported from /pages/admin or /components/admin only ships when a visitor
// actually hits an /admin/* URL.
const Setup = lazy(() => import('./pages/admin/Setup').then((m) => ({ default: m.Setup })));
const Login = lazy(() => import('./pages/admin/Login').then((m) => ({ default: m.Login })));
const AdminLayout = lazy(() =>
  import('./components/admin/AdminLayout').then((m) => ({ default: m.AdminLayout }))
);
const Dashboard = lazy(() =>
  import('./pages/admin/Dashboard').then((m) => ({ default: m.Dashboard }))
);
const HeroEditor = lazy(() =>
  import('./pages/admin/HeroEditor').then((m) => ({ default: m.HeroEditor }))
);
const SettingsEditor = lazy(() =>
  import('./pages/admin/SettingsEditor').then((m) => ({ default: m.SettingsEditor }))
);
const GalleryEditor = lazy(() =>
  import('./pages/admin/GalleryEditor').then((m) => ({ default: m.GalleryEditor }))
);
const ApplicationsManager = lazy(() =>
  import('./pages/admin/ApplicationsManager').then((m) => ({ default: m.ApplicationsManager }))
);
const MembersManager = lazy(() =>
  import('./pages/admin/MembersManager').then((m) => ({ default: m.MembersManager }))
);
const RsvpsManager = lazy(() =>
  import('./pages/admin/RsvpsManager').then((m) => ({ default: m.RsvpsManager }))
);
const SubmissionsManager = lazy(() =>
  import('./pages/admin/SubmissionsManager').then((m) => ({ default: m.SubmissionsManager }))
);
const CollectionManager = lazy(() =>
  import('./components/admin/CollectionManager').then((m) => ({ default: m.CollectionManager }))
);
const ItemEditor = lazy(() =>
  import('./components/admin/ItemEditor').then((m) => ({ default: m.ItemEditor }))
);

// Member portal (public-facing, signed-in users).
const MemberSignup = lazy(() =>
  import('./pages/MemberSignup').then((m) => ({ default: m.MemberSignup }))
);
const MemberLogin = lazy(() =>
  import('./pages/MemberLogin').then((m) => ({ default: m.MemberLogin }))
);
const MembershipApply = lazy(() =>
  import('./pages/MembershipApply').then((m) => ({ default: m.MembershipApply }))
);
const MemberDashboard = lazy(() =>
  import('./pages/MemberDashboard').then((m) => ({ default: m.MemberDashboard }))
);

// Each schema-driven collection gets a list page + edit/new page.
const collections = [
  'programs',
  'projects',
  'news',
  'events',
  'leadership',
  'chapters',
  'donationTiers',
  'resources',
  'impactMetrics',
];

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
};

const wrap = (node: React.ReactNode) => (
  <Layout>
    <PageTransition>{node}</PageTransition>
  </Layout>
);

const AdminFallback = () => (
  <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', color: '#64748b' }}>
    Loading admin…
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    // Admin routes: no public Layout, no page transitions.
    return (
      <Suspense fallback={<AdminFallback />}>
        <Routes>
          <Route path="/admin/setup" element={<Setup />} />
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireRole={['admin', 'super_admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="hero" element={<HeroEditor />} />
            <Route path="gallery" element={<GalleryEditor />} />
            <Route path="settings" element={<SettingsEditor />} />
            <Route path="applications" element={<ApplicationsManager />} />
            <Route path="members" element={<MembersManager />} />
            <Route path="rsvps" element={<RsvpsManager />} />
            <Route path="inbox" element={<SubmissionsManager />} />
            {collections.map((c) => (
              <Route key={c} path={c}>
                <Route index element={<CollectionManager collectionKey={c} />} />
                <Route path="new" element={<ItemEditor collectionKey={c} />} />
                <Route path=":id" element={<ItemEditor collectionKey={c} />} />
              </Route>
            ))}
          </Route>
        </Routes>
      </Suspense>
    );
  }

  // Member portal: same Layout as public (header/footer) but no page transitions.
  if (location.pathname.startsWith('/portal')) {
    return (
      <Suspense fallback={<AdminFallback />}>
        <Routes>
          <Route path="/portal/signup" element={wrap(<MemberSignup />)} />
          <Route path="/portal/login" element={wrap(<MemberLogin />)} />
          <Route path="/portal/apply" element={wrap(<MembershipApply />)} />
          <Route path="/portal" element={wrap(<MemberDashboard />)} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={wrap(<Home />)} />
          <Route path="/about" element={wrap(<About />)} />
          <Route path="/projects" element={wrap(<Projects />)} />
          <Route path="/impact" element={wrap(<Impact />)} />
          <Route path="/resources" element={wrap(<Resources />)} />
          <Route path="/get-involved" element={wrap(<GetInvolvedPage />)} />
          <Route path="/events" element={wrap(<Events />)} />
          <Route path="/donate" element={wrap(<Donate />)} />
          <Route path="/news" element={wrap(<News />)} />
          <Route path="/contact" element={wrap(<Contact />)} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
