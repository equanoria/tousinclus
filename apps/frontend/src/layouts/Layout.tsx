import { IconInfoCircle } from '@tabler/icons-react';
import type { ReactNode } from 'react';
import { Button } from '../components/Button/Button';
import { Help } from '../components/Help/Help';
import { useAppState } from '../context/AppStateProvider';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isHelpOpen, setHelpOpen, currentStep } = useAppState();

  // Règles du jeu en fonction de l'étape actuelle
  const gameRules: Record<number, string> = {
    0: 'Bienvenue dans le jeu ! Voici comment commencer.',
    1: 'Règles de jeu de réflexion',
    2: 'Règles de jeu de débat',
  };

  return (
    <div className={styles.layout}>
      {/* <nav className="a11y-skip-content">
        <ul>
          <li>
            <a href="#main">Aller au contenu principal</a>
          </li>
          <li>
            <a href="#main">Aller à un autre endroit</a>
          </li>
        </ul>
      </nav> */}

      {currentStep !== 3 && (
        <Button
          variant="icon"
          startIcon={<IconInfoCircle />}
          onClick={() => setHelpOpen(true)}
          className={styles.layoutHelp}
        >
          Aide
        </Button>
      )}

      {isHelpOpen && currentStep !== 3 && (
        <Help
          title="Aide"
          content={gameRules[currentStep] || 'Aucune règle disponible.'}
        />
      )}

      <main id="main">{children}</main>
    </div>
  );
};
