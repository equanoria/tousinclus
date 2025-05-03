export class LocalStorageManager {
    setItem(key, item) {
        localStorage.setItem(key, JSON.stringify(item));
    }
    getItem(key) {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : undefined;
    }
}
//# sourceMappingURL=LocalStorageManager.js.map