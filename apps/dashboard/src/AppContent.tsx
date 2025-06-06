import { Route, Routes } from 'react-router-dom';
import { Login } from './views/Login/Login';

export const AppContent = () => {
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
          <Route path="/login" element={<Login />} />
          {/* <Route path="/games" element={<GameApp />} />
          <Route path="/games/create" element={<Contact />} />
          <Route path="/games/export" element={<Legal />} /> */}
        </Routes>
      </main>

      <footer>
        <nav aria-label="Navigation du site">
          {/* <Link href="/">Accueil</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/legal">Mention Légales</Link> */}
        </nav>
      </footer>
    </>
  );
};
