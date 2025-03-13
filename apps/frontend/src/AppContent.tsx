import { useEffect } from 'react';
import { useAppState } from './context/AppStateProvider';
import { GameConnection } from './views/GameConnection/GameConnection';
import { GameReflection } from './views/GameReflection/GameReflection';
import { GameDebate } from './views/GameDebate/GameDebate';
import { GameResults } from './views/GameResults/GameResults';

const AppContent = () => {
  const { currentStep, setCurrentView, currentView } = useAppState();

  useEffect(() => {
    switch (currentStep) {
      case 0:
        setCurrentView(<GameConnection />);
        break;
      case 1:
        setCurrentView(<GameReflection />);
        break;
      case 2:
        setCurrentView(<GameDebate />);
        break;
      case 3:
        setCurrentView(<GameResults team={'team1'} />);
        break;
      default:
        setCurrentView(<GameConnection />);
    }
  }, [currentStep, setCurrentView]);

  return <>{currentView}</>; 
};

export default AppContent;
