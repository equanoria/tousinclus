import type { ReactNode } from 'react';
import { useState } from 'react';
import { RulesModal } from '../../components/RulesModal/RulesModal';
import { Button } from '../../components/Button/Button';
import { IconInfoCircle } from '@tabler/icons-react';
import { Link } from '../../components/Link/Link';
import { Overlay } from '../../components/Overlay/Overlay';
import { SocketBanner } from '../../core/SocketBanner/SocketBanner';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <section className={styles.layout}>
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

      <SocketBanner/>

      <main id="main">
        {children}
        <Overlay isVisible={isModalOpen} onClick={() => setModalOpen(false)} />
        {isModalOpen && (
          <RulesModal
            title="Connexion règles"
            onClose={() => setModalOpen(false)}
          >
            À cette étape, chaque équipe doit rassembler son deck de cartes en
            version physique. Les cartes s'affichent à l’écran : à vous de les
            retrouver dans le matériel mis à disposition et de constituer votre
            jeu en vrai. [...]
          </RulesModal>
        )}
      </main>

      <footer>
        <nav aria-label="Navigation du site">
          <Link href="/">Accueil</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/legal">Mentions Légales</Link>
        </nav>
      </footer>
    </section>
  );
};
