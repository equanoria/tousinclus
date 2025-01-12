import { LocalStorageManager } from "./LocalStorageManager";

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system'
}

export class ThemeManager {
  private readonly localStorageManager = new LocalStorageManager();
  static readonly LOCAL_STORAGE_KEY: string = 'theme';
  static readonly FALLBACK_THEME: Theme = Theme.LIGHT;
  static readonly DATA_NAME: string = 'data-theme';
  private theme: Theme;

  constructor() {
    this.theme = this.determineInitialTheme();
    this.applyTheme();
  }

  public switch(theme?: Theme): this {
    if (theme) {
      this.setDefault(theme);
    } else {
      theme = this.localStorageManager.getItem<Theme>(ThemeManager.LOCAL_STORAGE_KEY);
    }

    this.theme = theme ?? ThemeManager.FALLBACK_THEME;

    this.applyTheme();
    return this;
  }

  public getTheme(): Theme {
    return this.theme;
  }

  private setDefault(theme: Theme): this {
    this.localStorageManager.setItem<Theme>(ThemeManager.LOCAL_STORAGE_KEY, theme);

    return this;
  }

  private applyTheme(): this {
    const effectiveTheme = this.getEffectiveTheme();
    document.documentElement.setAttribute(ThemeManager.DATA_NAME, effectiveTheme);

    return this;
  }

  private getEffectiveTheme(): Theme {
    if (this.theme === Theme.SYSTEM) {
      const prefersDarkScheme = window.matchMedia?.('(prefers-color-scheme: dark)').matches;

      return prefersDarkScheme ? Theme.DARK : Theme.LIGHT;
    }

    return this.theme;
  }

  private determineInitialTheme(): Theme {
    const storedTheme = this.localStorageManager.getItem<Theme>(ThemeManager.LOCAL_STORAGE_KEY);
    if (storedTheme) {
      return storedTheme;
    }

    this.setDefault(Theme.SYSTEM);
    
    return Theme.SYSTEM;
  }
}
