import { useEffect } from 'react';
import { useAppState } from './context/AppStateProvider';

import { GamesList } from './views/GamesList/GamesList';
import { DashboardConnection } from './views/DashboardConnection/DashboardConnection';

const AppContent = () => {
  const { currentView, setCurrentView } = useAppState();

  useEffect(() => {
    setCurrentView(
    // <GamesList />
    <DashboardConnection />
    );
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
