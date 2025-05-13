export declare enum Contrast {
    SYSTEM = "system",
    MORE = "more",
    LESS = "less"
}
export declare class ContrastManager {
    private readonly localStorageManager;
    static readonly LOCAL_STORAGE_KEY: string;
    static readonly FALLBACK_CONTRAST: Contrast;
    static readonly DATA_NAME: string;
    private contrast;
    constructor();
    switch(contrast?: Contrast): this;
    getContrast(): Contrast;
    private setDefault;
    private applyContrast;
    private determineInitialContrast;
    private getEffectiveContrast;
}
//# sourceMappingURL=ContrastManager.d.ts.map