import { Route, Routes } from 'react-router-dom';
import { GameApp } from './GameApp';
import { Link } from './components/Link/Link';
import { SocketBanner } from './core/SocketBanner/SocketBanner';
import { Contact } from './views/Contact/Contact';
import { Legal } from './views/Legal/Legal';

export const AppContent = () => {
  return (
    <>
      <nav className="a11y-skip-content" aria-label="Navigation rapide">
        <ul>
          <li>
            <a href="#main">Aller au contenu principal</a>
          </li>
          <li>
            <a href="#footer">Aller au pied de page</a>
          </li>
        </ul>
      </nav>

      <SocketBanner />

      <main id="main">
        <Routes>
          <Route path={GameApp.path} element={<GameApp />} />
          <Route path={Contact.path} element={<Contact />} />
          <Route path={Legal.path} element={<Legal />} />
        </Routes>
      </main>

      <footer id="footer">
        <nav aria-label="Navigation du site">
          <Link href={GameApp.path}>Accueil</Link>
          <Link href={Contact.path}>Contact</Link>
          <Link href={Legal.path}>Mention Légales</Link>
        </nav>
      </footer>
    </>
  );
};
