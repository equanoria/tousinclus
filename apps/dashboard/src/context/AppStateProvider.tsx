import {
  type ContrastManager,
  type FontManager,
  type LocaleManager,
  type ThemeManager,
  type TitleManager,
  contrastManager,
  fontManager,
  localeManager,
  themeManager,
  titleManager,
} from '@tousinclus/managers';
import { type ReactNode, createContext, useContext } from 'react';

export interface AppStateContextProps {
  themeManager: ThemeManager;
  fontManager: FontManager;
  localeManager: LocaleManager;
  contrastManager: ContrastManager;
  titleManager: TitleManager;
}

const AppStateContext = createContext<AppStateContextProps | undefined>(
  undefined,
);

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AppStateContext.Provider
      value={{
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
