declare class LocalStorageManager {
    setItem<T>(key: string, item: T): void;
    getItem<T>(key: string): T | undefined;
    removeItem(key: string): void;
}
export declare const localStorageManager: LocalStorageManager;
export type { LocalStorageManager };
//# sourceMappingURL=LocalStorageManager.d.ts.map