import { Route, Routes } from 'react-router-dom';
import { Contact } from './views/Contact/Contact';
import { Legal } from './views/Legal/Legal';
import { Link } from './components/Link/Link';
import { GameApp } from './GameApp';
import { SocketBanner } from './core/SocketBanner/SocketBanner';
import { RulesModal } from './components/RulesModal/RulesModal';
import { useState } from 'react';
import { Overlay } from './components/Overlay/Overlay';
import { Button } from './components/Button/Button';
import { IconInfoCircle } from '@tabler/icons-react';

export const AppContent = () => {
  const [isModalOpen, setModalOpen] = useState(false);

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

      <header>
        <Button
          variant="icon"
          onClick={() => setModalOpen(true)}
          startIcon={<IconInfoCircle aria-hidden="true" />}
        >
          Aide
        </Button>
      </header>

      <SocketBanner />

      <main id="main">
        <Routes>
          <Route path="/" element={<GameApp />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/legal" element={<Legal />} />
        </Routes>

        <Overlay isVisible={isModalOpen} onClick={() => setModalOpen(false)} />
        {isModalOpen && (
          <RulesModal
            title="Connexion règles"
            onClose={() => setModalOpen(false)}
          >
            À cette étape, chaque équipe doit rassembler son deck de cartes en
            version physique. Les cartes s'affichent à l’écran : à vous de les
            retrouver dans le matériel mis à disposition et de constituer votre
            jeu en vrai. Prenez le temps de bien vérifier que vous avez toutes
            les cartes nécessaires avant de commencer la prochaine étape. Une
            fois vos decks prêts, vous pourrez entrer dans le vif du jeu !
          </RulesModal>
        )}
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
