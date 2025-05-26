declare class SessionStorageManager {
    setItem<T>(key: string, item: T): void;
    getItem<T>(key: string): T | undefined;
}
export declare const sessionStorageManager: SessionStorageManager;
export type { SessionStorageManager };
//# sourceMappingURL=SessionStorageManager.d.ts.map