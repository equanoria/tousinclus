export declare enum Contrast {
    SYSTEM = "system",
    MORE = "more",
    LESS = "less"
}
declare class ContrastManager {
    static readonly LOCAL_STORAGE_KEY = "contrast";
    static readonly FALLBACK_CONTRAST = Contrast.SYSTEM;
    static readonly DATA_NAME = "data-contrast";
    private contrast;
    constructor();
    switch(contrast?: Contrast): this;
    getContrast(): Contrast;
    private setDefault;
    private applyContrast;
    private determineInitialContrast;
    private getEffectiveContrast;
}
export declare const contrastManager: ContrastManager;
export type { ContrastManager };
//# sourceMappingURL=ContrastManager.d.ts.map