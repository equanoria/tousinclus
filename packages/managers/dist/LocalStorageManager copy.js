class LocalStorageManager {
    setItem(key, item) {
        localStorage.setItem(key, JSON.stringify(item));
    }
    getItem(key) {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : undefined;
    }
}
export const localStorageManager = new LocalStorageManager();
//# sourceMappingURL=LocalStorageManager%20copy.js.map