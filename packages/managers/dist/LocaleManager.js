import { localStorageManager } from './LocalStorageManager';
class LocaleManager {
    static LOCAL_STORAGE_KEY = 'locale';
    static FALLBACK_LOCALE = {
        code: 'fr-FR',
        name: 'Français',
        direction: 'ltr',
    };
    locale = LocaleManager.FALLBACK_LOCALE;
    supportedLocales = [LocaleManager.FALLBACK_LOCALE];
    switch(localeCode) {
        if (localeCode === 'system') {
            this.setDefaultLocale('system');
            this.locale = this.getSystemLocale() || LocaleManager.FALLBACK_LOCALE;
        }
        else if (localeCode) {
            const newLocale = this.supportedLocales.find((locale) => locale.code === localeCode);
            if (newLocale) {
                this.setDefaultLocale(localeCode);
                this.locale = newLocale;
            }
            else {
                console.warn(`Locale "${localeCode}" not supported. Falling back.`);
                this.locale = LocaleManager.FALLBACK_LOCALE;
            }
        }
        else {
            console.warn('Locale not specified. Falling back to default.');
            this.locale = LocaleManager.FALLBACK_LOCALE;
        }
        this.applyLocale();
        return this;
    }
    getLocale() {
        return this.locale;
    }
    init(supportedLocales) {
        if (supportedLocales) {
            this.supportedLocales = supportedLocales;
        }
        const storedLocaleCode = localStorageManager.getItem(LocaleManager.LOCAL_STORAGE_KEY);
        if (storedLocaleCode) {
            if (storedLocaleCode === 'system') {
                this.locale = this.getSystemLocale() || LocaleManager.FALLBACK_LOCALE;
            }
            else {
                const storedLocale = this.supportedLocales.find((locale) => locale.code === storedLocaleCode);
                if (storedLocale) {
                    this.locale = storedLocale;
                }
                else {
                    console.warn(`Stored locale "${storedLocaleCode}" is not supported. Reverting to system locale.`);
                    this.setDefaultLocale('system');
                    this.locale = this.getSystemLocale() || LocaleManager.FALLBACK_LOCALE;
                }
            }
        }
        else {
            this.setDefaultLocale('system');
            this.locale = this.getSystemLocale() || LocaleManager.FALLBACK_LOCALE;
        }
        this.applyLocale();
        return this;
    }
    setDefaultLocale(localeCode) {
        localStorageManager.setItem(LocaleManager.LOCAL_STORAGE_KEY, localeCode);
        return this;
    }
    applyLocale() {
        document.documentElement.lang = this.locale.code;
        document.documentElement.dir = this.locale.direction;
        return this;
    }
    getSystemLocale() {
        const navigatorLanguages = navigator.languages || [navigator.language];
        for (const lang of navigatorLanguages) {
            const baseLang = lang.split('-')[0];
            const exactMatch = this.supportedLocales.find((locale) => locale.code.startsWith(baseLang));
            if (exactMatch)
                return exactMatch;
            const closeMatch = this.supportedLocales.find((locale) => locale.code.slice(0, 2) === baseLang.slice(0, 2));
            if (closeMatch)
                return closeMatch;
        }
        return undefined;
    }
}
export const localeManager = new LocaleManager();
//# sourceMappingURL=LocaleManager.js.map