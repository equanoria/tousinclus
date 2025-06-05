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
          <RulesModal title="dnfkjsfkj" onClose={() => setModalOpen(false)}>
            Pendant la durée impartie, affichée en haut à droite de l’écran,
            vous allez devoir compléter vos fiches solutions. Chaque fiche est
            associée à l’utilisateur extrême mis en avant. Au total, vous avez 6
            utilisateurs extrêmes et donc 6 fiches solutions à remplir. Dans
            votre fiche solution, vous devez: Décrire le défaut d’inclusion de
            la carte utilisateur mise en avant, lié à la carte situation
            d’usage. Décrire la solution que vous proposez pour répondre à ce
            défaut Identifier les autres utilisateurs qui pourraient être
            concernés par votre solution (facultatif).
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
