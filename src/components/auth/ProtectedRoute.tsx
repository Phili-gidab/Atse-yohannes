import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, type UserRole } from '../../hooks/useAuth';

interface Props {
  children: React.ReactNode;
  /** If set, user must have one of these roles. Otherwise just being signed in is enough. */
  requireRole?: UserRole | UserRole[];
  redirectTo?: string;
}

const rolePasses = (role: UserRole, required?: UserRole | UserRole[]) => {
  if (!required) return true;
  const list = Array.isArray(required) ? required : [required];
  if (list.includes(role)) return true;
  // super_admin always passes admin gates
  if (role === 'super_admin' && list.includes('admin')) return true;
  return false;
};

export const ProtectedRoute = ({ children, requireRole, redirectTo = '/admin/login' }: Props) => {
  const { user, loading, configured } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', color: '#64748b' }}>
        Loading…
      </div>
    );
  }

  if (!configured) {
    return (
      <div style={{ padding: '6rem 2rem', textAlign: 'center', color: '#475569' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>Backend not configured</h2>
        <p>
          Add your Firebase env vars to <code>.env.local</code> to enable this area.
        </p>
      </div>
    );
  }

  if (!user) return <Navigate to={redirectTo} state={{ from: location }} replace />;
  if (!rolePasses(user.role, requireRole)) return <Navigate to="/" replace />;

  return <>{children}</>;
};
