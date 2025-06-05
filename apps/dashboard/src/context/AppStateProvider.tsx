import type React from 'react';
import {
  type ReactNode,
  createContext,
  useContext,
  useState,
} from 'react';
import { 
  type ContrastManager,
  contrastManager,
  type FontManager,
  fontManager,
  type LocaleManager,
  localeManager,
  type ThemeManager,
  themeManager,
  type TitleManager,
  titleManager,
} from '@tousinclus/managers';
import { DashboardConnection } from '../views/DashboardConnection/DashboardConnection';

export interface AppStateContextProps {
  currentView: JSX.Element;
  setCurrentView: (view: JSX.Element) => void;
  themeManager: ThemeManager;
  fontManager: FontManager;
  localeManager: LocaleManager;
  contrastManager: ContrastManager;
  titleManager: TitleManager;
}

const AppStateContext = createContext<AppStateContextProps | undefined>(
  undefined,
);

export const AppStateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentView, setCurrentView] = useState<JSX.Element>(
    <DashboardConnection />,
  );

  return (
    <AppStateContext.Provider
      value={{
        currentView,
        setCurrentView,
        themeManager,
        fontManager,
        localeManager,
        contrastManager,
        titleManager,
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
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
};
