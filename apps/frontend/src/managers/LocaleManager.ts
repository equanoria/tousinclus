import { DirectusService } from '../services/DirectusService';
import { LocalStorageManager } from './LocalStorageManager';
import { TLanguage } from '@tousinclus/types';

export class LocaleManager {
  private localStorageManager = new LocalStorageManager();
  private directusService = DirectusService.getInstance();
  static readonly LOCAL_STORAGE_KEY = 'locale';
  static readonly FALLBACK_LOCALE: TLanguage = {
    code: 'fr-FR',
    name: 'Français',
    direction: 'ltr',
  };
  private locale: TLanguage = LocaleManager.FALLBACK_LOCALE;
  private supportedLocales: TLanguage[] = [LocaleManager.FALLBACK_LOCALE];

  constructor() {
    this.init();
  }

  public async switch(localeCode?: string): Promise<void> {
    const newLocale =
      this.supportedLocales.find((locale) => locale.code === localeCode) ||
      this.locale;

    this.setLocale(newLocale);
  }

  public getLocale(): TLanguage {
    return this.locale;
  }

  private async init(): Promise<void> {
    try {
      this.supportedLocales = await this.directusService.getLanguages();
    } catch {
      console.warn('Using fallback locale due to error fetching locales.');
    }

    const storedLocaleCode = this.localStorageManager.getItem<string>(
      LocaleManager.LOCAL_STORAGE_KEY
    );
    const initialLocale =
      this.supportedLocales.find((locale) => locale.code === storedLocaleCode) ||
      this.getBrowserLocale() ||
      LocaleManager.FALLBACK_LOCALE;

    this.setLocale(initialLocale);
  }

  private setLocale(locale: TLanguage): void {
    this.localStorageManager.setItem(LocaleManager.LOCAL_STORAGE_KEY, locale.code);
    this.locale = locale;
    this.applyLocale();
  }

  private applyLocale(): void {
    document.documentElement.lang = this.locale.code;
    document.documentElement.dir = this.locale.direction;
  }

  private getBrowserLocale(): TLanguage | undefined {
    const navigatorLanguages = navigator.languages || [navigator.language];

    for (const lang of navigatorLanguages) {
      const baseLang = lang.split('-')[0];

      const exactMatch = this.supportedLocales.find((locale) =>
        locale.code.startsWith(baseLang)
      );
      if (exactMatch) return exactMatch;

      const closeMatch = this.supportedLocales.find((locale) =>
        locale.code.slice(0, 2) === baseLang.slice(0, 2)
      );
      if (closeMatch) return closeMatch;
    }

    return undefined;
  }
}
