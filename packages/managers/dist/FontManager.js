import { LocalStorageManager } from './LocalStorageManager';
export var Font;
(function (Font) {
    Font["OPENDYSLEXIC"] = "OpenDyslexic";
    Font["DEFAULT"] = "default";
})(Font || (Font = {}));
export class FontManager {
    localStorageManager = new LocalStorageManager();
    static LOCAL_STORAGE_KEY = 'font';
    static FALLBACK_FONT = Font.DEFAULT;
    static DATA_NAME = 'data-font';
    font;
    constructor() {
        this.font = this.determineInitialFont();
        this.applyFont();
    }
    switch(font) {
        let resolvedFont = font;
        if (!resolvedFont) {
            resolvedFont = this.localStorageManager.getItem(FontManager.LOCAL_STORAGE_KEY);
        }
        this.font = resolvedFont ?? FontManager.FALLBACK_FONT;
        this.applyFont();
        return this;
    }
    getFont() {
        return this.font;
    }
    setDefault(font) {
        this.localStorageManager.setItem(FontManager.LOCAL_STORAGE_KEY, font);
        return this;
    }
    applyFont() {
        document.documentElement.setAttribute(FontManager.DATA_NAME, this.font);
        return this;
    }
    determineInitialFont() {
        const storedFont = this.localStorageManager.getItem(FontManager.LOCAL_STORAGE_KEY);
        if (storedFont) {
            return storedFont;
        }
        this.setDefault(Font.DEFAULT);
        return FontManager.FALLBACK_FONT;
    }
}
//# sourceMappingURL=FontManager.js.map