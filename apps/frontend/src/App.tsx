import { useState } from 'react';
import LandingPage from './views/LandingPage/LandingPage';
import { ThemeManager, Theme } from './utils/ThemeManager';
import { FontManager } from './utils/FontManager';
import { LocaleManager } from './utils/LocaleManager';
import { ContrastManager } from './utils/ContrastManager';

const App = () => {
  const [currentView, setCurrentView] = useState<JSX.Element>(<LandingPage />);

  new ThemeManager();
  new FontManager();
  new LocaleManager();
  new ContrastManager();

  return (
    <>
      <nav className="a11y-skip-content">
          <ul>
              <li><a href="#main">Aller au contenu principal</a></li>
              <li><a href="#main">Aller à un autre endoit</a></li>
          </ul>
      </nav>
      <main>
        { currentView }
      </main>
    </>
  );
};

export default App;
