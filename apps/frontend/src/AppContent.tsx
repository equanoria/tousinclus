import { useEffect } from 'react';
import { useAppState } from './context/AppStateProvider';
import { ComingSoonView } from './views/ComingSoonView/ComingSoonView';

const AppContent = () => {
  const { currentView, setCurrentView } = useAppState();

  useEffect(() => {
    setCurrentView(<ComingSoonView />);
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
