import { useEffect } from 'react';
import { useAppState } from './context/AppStateProvider';
import { GameConnection } from './views/GameConnection/GameConnection';
import { GameReflection } from './views/GameReflection/GameReflection';

const AppContent = () => {
  const { currentView, setCurrentView } = useAppState();

  useEffect(() => {
    gameService.gameStatus(({ status }) => {
      if (status === 'waiting') {
        setCurrentView(<GameConnection />);
      }
      if (status === 'reflection') {
        setCurrentView(<GameReflection />);
      }
    });
  }, [setCurrentView]);

  return (
    <>
      <nav className="a11y-skip-content">
        <ul>
          <li>
            <a href="#main">Aller au contenu principal</a>
          </li>
          <li>
            <a href="#main">Aller à un autre endroit</a>
          </li>
        </ul>
      </nav>
      <main id="main">{currentView}</main>
    </>
  );
};

export default AppContent;
