import { EGameStatus } from '@tousinclus/types';
import { useEffect } from 'react';
import { useAppState } from './context/AppStateProvider';
import { gameService } from './services/game/game.service';
import { ErrorView } from './views/Error/ErrorView';
import { GameConnection } from './views/GameConnection/GameConnection';
import { GameDebate } from './views/GameDebate/GameDebate';
import { GameReflection } from './views/GameReflection/GameReflection';

const views: Partial<Record<EGameStatus, JSX.Element>> = {
  [EGameStatus.REFLECTION]: <GameReflection />,
  [EGameStatus.DEBATE]: <GameDebate />,
  [EGameStatus.RESULT]: <ErrorView />,
};

export const GameApp = () => {
  const { currentView, setCurrentView } = useAppState();

  useEffect(() => {
    gameService
      .onGameStatus(({ gameStatus }) => setCurrentView(views[gameStatus] || <GameConnection />))
      .onWaitingResponse(({ data }) => setCurrentView(views[data.status] || <GameConnection />));
  }, [setCurrentView]);

  return currentView;
};
