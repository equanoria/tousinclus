export declare enum Font {
    OPENDYSLEXIC = "OpenDyslexic",
    DEFAULT = "default"
}
export declare class FontManager {
    private readonly localStorageManager;
    static readonly LOCAL_STORAGE_KEY: string;
    static readonly FALLBACK_FONT: Font;
    static readonly DATA_NAME: string;
    private font;
    constructor();
    switch(font?: Font): this;
    getFont(): Font;
    private setDefault;
    private applyFont;
    private determineInitialFont;
}
//# sourceMappingURL=FontManager.d.ts.map