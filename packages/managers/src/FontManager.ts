import { localStorageManager } from "./LocalStorageManager";

export enum Font {
  OPENDYSLEXIC = 'OpenDyslexic',
  DEFAULT = 'default',
}

class FontManager {
  static readonly LOCAL_STORAGE_KEY = 'font';
  static readonly FALLBACK_FONT = Font.DEFAULT;
  static readonly DATA_NAME = 'data-font';
  private font = FontManager.FALLBACK_FONT;

  constructor() {
    this.font = this.determineInitialFont();
    this.applyFont();
  }

  /**
   * Switches the font. If no font is provided, it retrieves the current setting from localStorage.
   * If a valid font is provided, it sets it as the new font.
   */
  public switch(font?: Font): this {
    let resolvedFont = font;

    if (!resolvedFont) {
      resolvedFont = localStorageManager.getItem<Font>(
        FontManager.LOCAL_STORAGE_KEY,
      );
    }

    this.font = resolvedFont ?? FontManager.FALLBACK_FONT;

    this.applyFont();
    return this;
  }

  /**
   * Retrieves the current font setting.
   */
  public getFont(): Font {
    return this.font;
  }

  /**
   * Sets the default font value in localStorage.
   * This method ensures the font preference is saved for future visits.
   */
  private setDefault(font: Font): this {
    localStorageManager.setItem(FontManager.LOCAL_STORAGE_KEY, font);

    return this;
  }

  /**
   * Applies the active font to the root element of the document.
   * This updates the `data-font` attribute with the current font setting.
   */
  private applyFont(): this {
    document.documentElement.setAttribute(FontManager.DATA_NAME, this.font);

    return this;
  }

  /**
   * Determines the initial font setting.
   * This method checks localStorage first, and if no value is found, defaults to the fallback font.
   */
  private determineInitialFont(): Font {
    const storedFont = localStorageManager.getItem<Font>(
      FontManager.LOCAL_STORAGE_KEY,
    );
    if (storedFont) {
      return storedFont;
    }

    this.setDefault(Font.DEFAULT);

    return FontManager.FALLBACK_FONT;
  }
}

export const fontManager = new FontManager();
export type { FontManager };
