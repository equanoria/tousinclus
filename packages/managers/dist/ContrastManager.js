import { localStorageManager } from "./LocalStorageManager";
export var Contrast;
(function (Contrast) {
    Contrast["SYSTEM"] = "system";
    Contrast["MORE"] = "more";
    Contrast["LESS"] = "less";
})(Contrast || (Contrast = {}));
class ContrastManager {
    static LOCAL_STORAGE_KEY = 'contrast';
    static FALLBACK_CONTRAST = Contrast.SYSTEM;
    static DATA_NAME = 'data-contrast';
    contrast = ContrastManager.FALLBACK_CONTRAST;
    constructor() {
        this.contrast = this.determineInitialContrast();
        this.applyContrast();
    }
    switch(contrast) {
        let resolvedContrast = contrast;
        if (!resolvedContrast) {
            resolvedContrast = localStorageManager.getItem(ContrastManager.LOCAL_STORAGE_KEY);
        }
        this.contrast = resolvedContrast ?? ContrastManager.FALLBACK_CONTRAST;
        this.applyContrast();
        return this;
    }
    getContrast() {
        return this.contrast;
    }
    setDefault(contrast) {
        localStorageManager.setItem(ContrastManager.LOCAL_STORAGE_KEY, contrast);
        return this;
    }
    applyContrast() {
        const effectiveContrast = this.getEffectiveContrast();
        document.documentElement.setAttribute(ContrastManager.DATA_NAME, effectiveContrast);
        return this;
    }
    determineInitialContrast() {
        const storedContrast = localStorageManager.getItem(ContrastManager.LOCAL_STORAGE_KEY);
        if (storedContrast) {
            return storedContrast;
        }
        this.setDefault(ContrastManager.FALLBACK_CONTRAST);
        return ContrastManager.FALLBACK_CONTRAST;
    }
    getEffectiveContrast() {
        if (this.contrast === Contrast.SYSTEM) {
            const prefersMoreContrast = window.matchMedia('(prefers-contrast: more)').matches;
            const prefersLessContrast = window.matchMedia('(prefers-contrast: less)').matches;
            if (prefersMoreContrast) {
                return Contrast.MORE;
            }
            if (prefersLessContrast) {
                return Contrast.LESS;
            }
            return Contrast.SYSTEM;
        }
        return this.contrast;
    }
}
export const contrastManager = new ContrastManager();
//# sourceMappingURL=ContrastManager.js.map