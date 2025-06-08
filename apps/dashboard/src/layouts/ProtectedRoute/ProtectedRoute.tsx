import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) console.warn('ProtectedRoute: loading state is true, this should not happen in production');

  if (loading) return <progress aria-label="Chargement en cours" />;

  if (!user) {
    return <Navigate to="/login" replace state={{ path: location.pathname }} />
  }

  return children;
};
