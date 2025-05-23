import { useEffect } from 'react';
import { useAppState } from './context/AppStateProvider';
import { Deck } from './views/Deck/Deck';
// import { GameConnection } from './views/GameConnection/GameConnection';

const AppContent = () => {
  const { currentView, setCurrentView } = useAppState();

  useEffect(() => {
    setCurrentView(<Deck />);
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
