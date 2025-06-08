import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { Login } from './views/Login/Login';
import { ProtectedRoute } from './layouts/ProtectedRoute/ProtectedRoute';
import { Games } from './views/Games/Games';
import { GamesCreate } from './views/Games/Create/GamesCreate';
import { GamesExport } from './views/Games/Export/GamesExport';
import { useAuth } from './context/AuthProvider';

export const AppContent = () => {
  const { user, logout } = useAuth();

  return (
    <>
      <nav className="a11y-skip-content" aria-label="Navigation rapide">
        <ul>
          <li>
            <a href="#main">Aller au contenu principal</a>
          </li>
          <li>
            <a href="#main">Aller à un autre endroit</a>
          </li>
        </ul>
      </nav>

      <main id="main">
        <Routes>
          <Route path="/" element={<Navigate to="/games" replace />} />
          <Route path={Login.path} element={<Login />} />

          <Route path={Games.path} element=
            {
              <ProtectedRoute>
                <Games />
              </ProtectedRoute>
            }
          />
          <Route
            path={GamesCreate.path}
            element={
              <ProtectedRoute>
                <GamesCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path={GamesExport.path}
            element={
              <ProtectedRoute>
                <GamesExport />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <footer>
        <nav aria-label="Navigation du site">
          <Link to={Games.path}>Liste des parties</Link>
          <Link to={GamesCreate.path}>Nouvelle partie</Link>
          <Link to={GamesExport.path}>Export</Link>

          {user && (
            <Link to={Login.path} onClick={() => logout()}>
              Déconnexion
            </Link>
          )}
        </nav>
      </footer>
    </>
  );
};
