class LocalStorageManager {
    setItem(key, item) {
        localStorage.setItem(key, JSON.stringify(item));
    }
    getItem(key) {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : undefined;
    }
    removeItem(key) {
        localStorage.removeItem(key);
    }
}
export const localStorageManager = new LocalStorageManager();
//# sourceMappingURL=LocalStorageManager.js.map