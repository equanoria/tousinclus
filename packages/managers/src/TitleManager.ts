class TitleManager {
  static readonly DEFAULT_TITLE = 'Tous inclus';

  /**
   * Sets the document title to the specified value.
   * @param title - The new title to set.
   */
  set(title: string): this {
    document.title = `${title} - ${TitleManager.DEFAULT_TITLE}`;
    return this;
  }

  /**
   * Reset title to default.
   */
  reset(): this {
    document.title = TitleManager.DEFAULT_TITLE;
    return this;
  }
}

export const titleManager = new TitleManager();
export type { TitleManager };
