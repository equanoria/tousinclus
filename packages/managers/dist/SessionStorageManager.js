class SessionStorageManager {
    setItem(key, item) {
        sessionStorage.setItem(key, JSON.stringify(item));
    }
    getItem(key) {
        const item = sessionStorage.getItem(key);
        return item ? JSON.parse(item) : undefined;
    }
    removeItem(key) {
        sessionStorage.removeItem(key);
    }
}
export const sessionStorageManager = new SessionStorageManager();
//# sourceMappingURL=SessionStorageManager.js.map