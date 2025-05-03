import { LocalStorageManager } from './LocalStorageManager';
export var Theme;
(function (Theme) {
    Theme["LIGHT"] = "light";
    Theme["DARK"] = "dark";
    Theme["SYSTEM"] = "system";
})(Theme || (Theme = {}));
export class ThemeManager {
    localStorageManager = new LocalStorageManager();
    static LOCAL_STORAGE_KEY = 'theme';
    static FALLBACK_THEME = Theme.LIGHT;
    static DATA_NAME = 'data-theme';
    theme;
    constructor() {
        this.theme = this.determineInitialTheme();
        this.applyTheme();
    }
    switch(theme) {
        let resolvedTheme = theme;
        if (!resolvedTheme) {
            resolvedTheme = this.localStorageManager.getItem(ThemeManager.LOCAL_STORAGE_KEY);
        }
        this.theme = resolvedTheme ?? ThemeManager.FALLBACK_THEME;
        this.applyTheme();
        return this;
    }
    getTheme() {
        return this.theme;
    }
    setDefault(theme) {
        this.localStorageManager.setItem(ThemeManager.LOCAL_STORAGE_KEY, theme);
        return this;
    }
    applyTheme() {
        const effectiveTheme = this.getEffectiveTheme();
        document.documentElement.setAttribute(ThemeManager.DATA_NAME, effectiveTheme);
        return this;
    }
    getEffectiveTheme() {
        if (this.theme === Theme.SYSTEM) {
            const prefersDarkScheme = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
            return prefersDarkScheme ? Theme.DARK : Theme.LIGHT;
        }
        return this.theme;
    }
    determineInitialTheme() {
        const storedTheme = this.localStorageManager.getItem(ThemeManager.LOCAL_STORAGE_KEY);
        if (storedTheme) {
            return storedTheme;
        }
        this.setDefault(Theme.SYSTEM);
        return Theme.SYSTEM;
    }
}
//# sourceMappingURL=ThemeManager.js.map