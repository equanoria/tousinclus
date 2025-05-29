import { Route, Routes } from 'react-router-dom';
import { Contact } from './views/Contact/Contact';
import { Legal } from './views/Legal/Legal';
import { Link } from './components/Link/Link';
import { GameApp } from './GameApp';
import { SocketBanner } from './core/SocketBanner/SocketBanner';

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

      <SocketBanner />

      <main id="main">
        <Routes>
          <Route path="/" element={<GameApp />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/legal" element={<Legal />} />
        </Routes>
      </main>

      <footer>
        <nav aria-label="Navigation du site">
          <Link href="/">Accueil</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/legal">Mention Légales</Link>
        </nav>
      </footer>
    </>
  );
};

