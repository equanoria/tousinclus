import type { TLanguage } from '@tousinclus/types';
declare class LocaleManager {
    static readonly LOCAL_STORAGE_KEY = "locale";
    static readonly FALLBACK_LOCALE: TLanguage;
    private locale;
    private supportedLocales;
    switch(localeCode?: string): this;
    getLocale(): TLanguage;
    init(supportedLocales?: TLanguage[]): this;
    private setDefaultLocale;
    private applyLocale;
    private getSystemLocale;
}
export declare const localeManager: LocaleManager;
export type { LocaleManager };
//# sourceMappingURL=LocaleManager.d.ts.map