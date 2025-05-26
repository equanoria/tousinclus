export declare enum Theme {
    LIGHT = "light",
    DARK = "dark",
    SYSTEM = "system"
}
declare class ThemeManager {
    static readonly LOCAL_STORAGE_KEY = "theme";
    static readonly FALLBACK_THEME = Theme.LIGHT;
    static readonly DATA_NAME = "data-theme";
    static readonly MATCH_MEDIA = "(prefers-color-scheme: dark)";
    private theme;
    constructor();
    switch(theme?: Theme): this;
    getTheme(): Theme;
    private setDefault;
    private applyTheme;
    private getEffectiveTheme;
    private determineInitialTheme;
    private listenToSystemChanges;
}
export declare const themeManager: ThemeManager;
export type { ThemeManager };
//# sourceMappingURL=ThemeManager.d.ts.map