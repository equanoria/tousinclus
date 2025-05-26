class LocalStorageManager {
  setItem<T>(key: string, item: T): void {
    localStorage.setItem(key, JSON.stringify(item));
  }

  getItem<T>(key: string): T | undefined {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : undefined;
  }
}

export const localStorageManager = new LocalStorageManager();
export type { LocalStorageManager };
