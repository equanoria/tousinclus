import type { TLanguage } from '@tousinclus/types';
export declare class LocaleManager {
    private localStorageManager;
    static readonly LOCAL_STORAGE_KEY = "locale";
    static readonly FALLBACK_LOCALE: TLanguage;
    private locale;
    private supportedLocales;
    switch(localeCode?: string): Promise<void>;
    getLocale(): TLanguage;
    init(supportedLocales?: TLanguage[]): Promise<void>;
    private setDefaultLocale;
    private applyLocale;
    private getSystemLocale;
}
//# sourceMappingURL=LocaleManager.d.ts.map