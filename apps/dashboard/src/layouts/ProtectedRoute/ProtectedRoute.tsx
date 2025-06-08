import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <progress aria-label="Chargement en cours" />;
  if (!user) return <Navigate to="/login" replace state={{ path: location.pathname }} />

  return children;
};
