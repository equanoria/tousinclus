class TitleManager {
    static DEFAULT_TITLE = 'Tous inclus';
    set(title) {
        document.title = `${title} - ${TitleManager.DEFAULT_TITLE}`;
        return this;
    }
    reset() {
        document.title = TitleManager.DEFAULT_TITLE;
        return this;
    }
}
export const titleManager = new TitleManager();
//# sourceMappingURL=TitleManager.js.map