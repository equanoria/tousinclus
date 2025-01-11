import { LocalStorageManager } from "./LocalStorageManager";

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system'
}

export class ThemeSwitcher {
  private readonly localStorageManager = new LocalStorageManager();
  static readonly LOCAL_STORAGE_KEY: string = 'theme';
  static readonly FALLBACK_THEME: Theme = Theme.LIGHT;
  static readonly DATA_NAME: string = 'data-theme';
  private theme: Theme;

  constructor() {
    this.theme = this.determineInitialTheme();
    this.applyTheme();
  }

  /**
   * Switch the current theme. If no theme is provided, use the stored theme.
   */
  public switch(theme?: Theme): this {
    if (theme) {
      this.setDefault(theme);
    } else {
      theme = this.localStorageManager.getItem<Theme>(ThemeSwitcher.LOCAL_STORAGE_KEY);
    }

    this.theme = theme ?? ThemeSwitcher.FALLBACK_THEME;

    this.applyTheme();
    return this;
  }

  /**
   * Get the active theme.
   */
  public getTheme(): Theme {
    return this.theme;
  }

  /**
   * Save the default theme in localStorage.
   */
  private setDefault(theme: Theme): this {
    this.localStorageManager.setItem<Theme>(ThemeSwitcher.LOCAL_STORAGE_KEY, theme);

    return this;
  }

  /**
   * Apply the theme to the HTML attribute.
   */
  private applyTheme(): this {
    const effectiveTheme = this.getEffectiveTheme();
    document.documentElement.setAttribute(ThemeSwitcher.DATA_NAME, effectiveTheme);

    return this;
  }

  /**
   * Get the effective theme, considering "system".
   */
  private getEffectiveTheme(): Theme {
    if (this.theme === Theme.SYSTEM) {
      const prefersDarkScheme = window.matchMedia?.('(prefers-color-scheme: dark)').matches;

      return prefersDarkScheme ? Theme.DARK : Theme.LIGHT;
    }

    return this.theme;
  }

  /**
   * Determine the initial theme (localStorage > system > fallback).
   */
  private determineInitialTheme(): Theme {
    const storedTheme = this.localStorageManager.getItem<Theme>(ThemeSwitcher.LOCAL_STORAGE_KEY);
    if (storedTheme) {
      return storedTheme;
    }

    this.setDefault(Theme.SYSTEM);
    
    return Theme.SYSTEM;
  }
}
