import { LocalStorageManager } from "./LocalStorageManager";

export enum Locale {
  EN = 'en',
  FR = 'fr',
}

export class LocaleManager {
  private readonly localStorageManager = new LocalStorageManager();
  static readonly LOCAL_STORAGE_KEY: string = 'locale';
  static readonly FALLBACK_LOCALE: Locale = Locale.FR;
  static readonly SUPPORTED_LOCALES: Locale[] = Object.values(Locale);
  private locale: Locale;

  constructor() {
    this.locale = this.determineInitialLocale();
    this.applyLocale();
  }

  public switch(locale?: Locale): this {
    if (locale) {
      this.setDefault(locale);
    } else {
      locale = this.localStorageManager.getItem<Locale>(LocaleManager.LOCAL_STORAGE_KEY);
    }

    this.locale = locale ?? LocaleManager.FALLBACK_LOCALE;

    this.applyLocale();
    return this;
  }

  public getLocale(): Locale {
    return this.locale;
  }

  private setDefault(locale: Locale): this {
    this.localStorageManager.setItem<Locale>(LocaleManager.LOCAL_STORAGE_KEY, locale);

    return this;
  }

  private applyLocale(): this {
    document.documentElement.lang = this.locale;

    return this;
  }

  private determineInitialLocale(): Locale {
    const storedLocale = this.localStorageManager.getItem<Locale>(LocaleManager.LOCAL_STORAGE_KEY);
    if (storedLocale && LocaleManager.SUPPORTED_LOCALES.includes(storedLocale)) {
      return storedLocale;
    }

    const browserLocale = this.getBrowserLocale();
    if (browserLocale && LocaleManager.SUPPORTED_LOCALES.includes(browserLocale)) {
      this.setDefault(browserLocale);
      return browserLocale;
    }

    return LocaleManager.FALLBACK_LOCALE;
  }

  private getBrowserLocale(): Locale | null {
    const navigatorLanguages = navigator.languages || [navigator.language];
    for (const lang of navigatorLanguages) {
      const baseLang = lang.split('-')[0];
      if (LocaleManager.SUPPORTED_LOCALES.includes(baseLang as Locale)) {
        return baseLang as Locale;
      }
    }

    return null;
  }
}
