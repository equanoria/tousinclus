import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthProvider';
import { ProtectedRoute } from './layouts/ProtectedRoute/ProtectedRoute';
import { Footer } from './templates/Footer/Footer';
import { Header } from './templates/Header/Header';
import { GamesCreate } from './views/Games/Create/GamesCreate';
import { GamesExport } from './views/Games/Export/GamesExport';
import { Games } from './views/Games/Games';
import { Login } from './views/Login/Login';

export const AppContent = () => {
  const { user } = useAuth();
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

      {user && <Header />}

      <main id="main">
        <Routes>
          <Route path="/" element={<Navigate to="/games" replace />} />
          <Route path={Login.path} element={<Login />} />

          <Route
            path={Games.path}
            element={
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

      {user && <Footer />}
    </>
  );
};
