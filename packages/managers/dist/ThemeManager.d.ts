export declare enum Theme {
    LIGHT = "light",
    DARK = "dark",
    SYSTEM = "system"
}
export declare class ThemeManager {
    private readonly localStorageManager;
    static readonly LOCAL_STORAGE_KEY: string;
    static readonly FALLBACK_THEME: Theme;
    static readonly DATA_NAME: string;
    private theme;
    constructor();
    switch(theme?: Theme): this;
    getTheme(): Theme;
    private setDefault;
    private applyTheme;
    private getEffectiveTheme;
    private determineInitialTheme;
}
//# sourceMappingURL=ThemeManager.d.ts.map