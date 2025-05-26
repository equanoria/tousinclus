class SessionStorageManager {
  setItem<T>(key: string, item: T): void {
    sessionStorage.setItem(key, JSON.stringify(item));
  }

  getItem<T>(key: string): T | undefined {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : undefined;
  }
}

export const sessionStorageManager = new SessionStorageManager();
export type { SessionStorageManager };
