import { localStorageManager } from './LocalStorageManager';
export var Theme;
(function (Theme) {
    Theme["LIGHT"] = "light";
    Theme["DARK"] = "dark";
    Theme["SYSTEM"] = "system";
})(Theme || (Theme = {}));
class ThemeManager {
    static LOCAL_STORAGE_KEY = 'theme';
    static FALLBACK_THEME = Theme.LIGHT;
    static DATA_NAME = 'data-theme';
    static MATCH_MEDIA = '(prefers-color-scheme: dark)';
    theme;
    constructor() {
        this.theme = this.determineInitialTheme();
        this.applyTheme().listenToSystemChanges();
    }
    switch(theme) {
        let resolvedTheme = theme;
        if (!resolvedTheme) {
            resolvedTheme = localStorageManager.getItem(ThemeManager.LOCAL_STORAGE_KEY);
        }
        this.theme = resolvedTheme ?? ThemeManager.FALLBACK_THEME;
        this.applyTheme();
        return this;
    }
    getTheme() {
        return this.theme;
    }
    setDefault(theme) {
        localStorageManager.setItem(ThemeManager.LOCAL_STORAGE_KEY, theme);
        return this;
    }
    applyTheme() {
        const effectiveTheme = this.getEffectiveTheme();
        document.documentElement.setAttribute(ThemeManager.DATA_NAME, effectiveTheme);
        return this;
    }
    getEffectiveTheme() {
        if (this.theme === Theme.SYSTEM) {
            const prefersDarkScheme = window.matchMedia?.(ThemeManager.MATCH_MEDIA).matches;
            return prefersDarkScheme ? Theme.DARK : Theme.LIGHT;
        }
        return this.theme;
    }
    determineInitialTheme() {
        const storedTheme = localStorageManager.getItem(ThemeManager.LOCAL_STORAGE_KEY);
        if (storedTheme) {
            return storedTheme;
        }
        this.setDefault(Theme.SYSTEM);
        return Theme.SYSTEM;
    }
    listenToSystemChanges() {
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
//# sourceMappingURL=ThemeManager.js.map