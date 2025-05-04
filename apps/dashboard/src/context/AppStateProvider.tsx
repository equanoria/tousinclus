import type React from 'react';
import { type ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ErrorView } from '../views/Error/ErrorView';
import { ContrastManager, FontManager, LocaleManager, ThemeManager } from '@tousinclus/managers';
import { DirectusService } from '../services/DirectusService';

export interface AppStateContextProps {
  directusService: DirectusService;
  currentView: JSX.Element;
  setCurrentView: (view: JSX.Element) => void;
  themeManager: ThemeManager;
  fontManager: FontManager;
  localeManager: LocaleManager;
  contrastManager: ContrastManager;
}

const AppStateContext = createContext<AppStateContextProps | undefined>(
  undefined,
);

export const AppStateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentView, setCurrentView] = useState<JSX.Element>(
    <ErrorView message="Cannot load view." />,
  );

  const directusService = useMemo(() => new DirectusService(), []);

  const themeManager = useMemo(() => new ThemeManager(), []);
  const fontManager = useMemo(() => new FontManager(), []);
  const localeManager = useMemo(() => new LocaleManager(), []);
  const contrastManager = useMemo(() => new ContrastManager(), []);

  useEffect(() => {
    const initializeLocaleManager = async () => {
      const languages = await directusService.getLanguages();
      localeManager.init(languages);
    };

    initializeLocaleManager();
  }, [directusService, localeManager]);

  return (
    <AppStateContext.Provider
      value={{
        directusService,
        currentView,
        setCurrentView,
        themeManager,
        fontManager,
        localeManager,
        contrastManager,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppState = (): AppStateContextProps => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState doit être utilisé dans un AppStateProvider');
  }
  return context;
};
