export declare enum Font {
    OPENDYSLEXIC = "OpenDyslexic",
    DEFAULT = "default"
}
declare class FontManager {
    static readonly LOCAL_STORAGE_KEY = "font";
    static readonly FALLBACK_FONT = Font.DEFAULT;
    static readonly DATA_NAME = "data-font";
    private font;
    constructor();
    switch(font?: Font): this;
    getFont(): Font;
    private setDefault;
    private applyFont;
    private determineInitialFont;
}
export declare const fontManager: FontManager;
export type { FontManager };
//# sourceMappingURL=FontManager.d.ts.map