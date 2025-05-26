import { useAppState } from './context/AppStateProvider';
import { EGameStatus } from '@tousinclus/types';
import { ErrorView } from './views/Error/ErrorView';
import { GameReflection } from './views/GameReflection/GameReflection';
import { gameService } from './services/game/game.service';
import { useEffect } from 'react';
import { GameConnection } from './views/GameConnection/GameConnection';
import SocketBanner from './core/SocketBanner/SocketBanner';

const views: Partial<Record<EGameStatus, JSX.Element>> = {
  [EGameStatus.REFLECTION]: <GameReflection />,
  [EGameStatus.DEBATE]: <ErrorView />,
  [EGameStatus.RESULT]: <ErrorView />,
};

const AppContent = () => {
  const { currentView, setCurrentView } = useAppState();

  useEffect(() => {
    gameService
      .onGameStatus(({ gameStatus }) => setCurrentView(views[gameStatus] || <GameConnection />))
      .onWaitingResponse(({ data }) => setCurrentView(views[data.status] || <GameConnection />));
  }, [setCurrentView])

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

      <SocketBanner />

      <main id="main">{currentView}</main>
    </>
  );
};

export default AppContent;
