import type { TLanguage } from '@tousinclus/types';
export declare class LocaleManager {
    private supportedLocales;
    private localStorageManager;
    static readonly LOCAL_STORAGE_KEY = "locale";
    static readonly FALLBACK_LOCALE: TLanguage;
    private locale;
    constructor(supportedLocales?: TLanguage[]);
    switch(localeCode?: string): Promise<void>;
    getLocale(): TLanguage;
    private init;
    private setDefaultLocale;
    private applyLocale;
    private getSystemLocale;
}
//# sourceMappingURL=LocaleManager.d.ts.map