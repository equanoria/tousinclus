import { localStorageManager } from "./LocalStorageManager";

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

class ThemeManager {
  static readonly LOCAL_STORAGE_KEY = 'theme';
  static readonly FALLBACK_THEME = Theme.LIGHT;
  static readonly DATA_NAME = 'data-theme';
  static readonly MATCH_MEDIA = '(prefers-color-scheme: dark)';
  private theme: Theme;

  constructor() {
    this.theme = this.determineInitialTheme();
    this
      .applyTheme()
      .listenToSystemChanges();
  }

  /**
   * Switches the theme. If no theme is provided, it retrieves the current setting from localStorage.
   * If a valid theme is provided, it sets it as the new theme.
   */
  switch(theme?: Theme): this {
    let resolvedTheme = theme;

    if (!resolvedTheme) {
      resolvedTheme = localStorageManager.getItem<Theme>(
        ThemeManager.LOCAL_STORAGE_KEY,
      );
    }

    this.theme = resolvedTheme ?? ThemeManager.FALLBACK_THEME;

    this.applyTheme();
    return this;
  }

  /**
   * Retrieves the current theme setting.
   */
  getTheme(): Theme {
    return this.theme;
  }

  /**
   * Sets the default theme value in localStorage.
   * This method ensures the theme preference is saved for future visits.
   */
  private setDefault(theme: Theme): this {
    localStorageManager.setItem(
      ThemeManager.LOCAL_STORAGE_KEY,
      theme,
    );

    return this;
  }

  /**
   * Applies the active theme to the root element of the document.
   * This updates the `data-theme` attribute with the current theme setting.
   */
  private applyTheme(): this {
    const effectiveTheme = this.getEffectiveTheme();
    document.documentElement.setAttribute(
      ThemeManager.DATA_NAME,
      effectiveTheme,
    );

    return this;
  }

  /**
   * Determines the initial theme setting.
   * This method checks localStorage first, and if no value is found, defaults to the system theme.
   */
  private getEffectiveTheme(): Theme {
    if (this.theme === Theme.SYSTEM) {
      const prefersDarkScheme = window.matchMedia?.(ThemeManager.MATCH_MEDIA).matches;

      return prefersDarkScheme ? Theme.DARK : Theme.LIGHT;
    }

    return this.theme;
  }

  /**
   * Retrieves the effective theme value.
   * If the system is set to "system" mode, it checks for the system's preferred theme.
   * It adjusts between "dark" or "light" based on the user's system preference.
   */
  private determineInitialTheme(): Theme {
    const storedTheme = localStorageManager.getItem<Theme>(
      ThemeManager.LOCAL_STORAGE_KEY,
    );
    if (storedTheme) {
      return storedTheme;
    }

    this.setDefault(Theme.SYSTEM);

    return Theme.SYSTEM;
  }

  /**
   * Adds a listener to detect system theme changes when in SYSTEM mode.
   */
  private listenToSystemChanges(): this {
    const mediaQuery = window.matchMedia(ThemeManager.MATCH_MEDIA);

    const listener = () => {
      if (this.theme === Theme.SYSTEM) {
        this.applyTheme();
      }
    };

    mediaQuery.addEventListener('change', listener);
    return this;
  }
}

export const themeManager = new ThemeManager();
export type { ThemeManager };
