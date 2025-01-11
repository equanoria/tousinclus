import { useState } from 'react';
import LandingPage from './views/LandingPage/LandingPage';
import { ThemeSwitcher } from './utils/ThemeSwitcher';

const App = () => {
  const [currentView, setCurrentView] = useState<JSX.Element>(<LandingPage />);

  const themeSwitcher = new ThemeSwitcher();
  themeSwitcher.switch();

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
