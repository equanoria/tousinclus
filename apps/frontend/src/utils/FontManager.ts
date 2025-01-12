import { LocalStorageManager } from "./LocalStorageManager";

export enum Font {
  OPENDYSLEXIC = 'OpenDyslexic',
  DEFAULT = 'default',
}

export class FontManager {
  private readonly localStorageManager = new LocalStorageManager();
  static readonly LOCAL_STORAGE_KEY: string = 'font';
  static readonly FALLBACK_FONT: Font = Font.DEFAULT;
  static readonly DATA_NAME: string = 'data-font';
  private font: Font;

  constructor() {
    this.font = this.determineInitialFont();
    this.applyFont();
  }

  public switch(font?: Font): this {
    if (font) {
      this.setDefault(font);
    } else {
      font = this.localStorageManager.getItem<Font>(FontManager.LOCAL_STORAGE_KEY);
    }

    this.font = font ?? FontManager.FALLBACK_FONT;

    this.applyFont();
    return this;
  }

  public getFont(): Font {
    return this.font;
  }

  private setDefault(font: Font): this {
    this.localStorageManager.setItem<Font>(FontManager.LOCAL_STORAGE_KEY, font);

    return this;
  }

  private applyFont(): this {
    document.documentElement.setAttribute(FontManager.DATA_NAME, this.font);

    return this;
  }

  private determineInitialFont(): Font {
    const storedFont = this.localStorageManager.getItem<Font>(FontManager.LOCAL_STORAGE_KEY);
    if (storedFont) {
      return storedFont;
    }

    this.setDefault(Font.DEFAULT);

    return FontManager.FALLBACK_FONT;
  }
}
