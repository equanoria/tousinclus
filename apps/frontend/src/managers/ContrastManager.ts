import { LocalStorageManager } from "./LocalStorageManager";

export enum Contrast {
  SYSTEM = 'system',
  MORE = 'more',
  LESS = 'less',
}

export class ContrastManager {
  private readonly localStorageManager = new LocalStorageManager();
  static readonly LOCAL_STORAGE_KEY: string = 'contrast';
  static readonly FALLBACK_CONTRAST: Contrast = Contrast.SYSTEM;
  static readonly DATA_NAME: string = 'data-contrast';
  private contrast: Contrast;

  constructor() {
    this.contrast = this.determineInitialContrast();
    this.applyContrast();
  }

  public switch(contrast?: Contrast): this {
    if (contrast) {
      this.setDefault(contrast);
    } else {
      contrast = this.localStorageManager.getItem<Contrast>(ContrastManager.LOCAL_STORAGE_KEY);
    }

    this.contrast = contrast ?? ContrastManager.FALLBACK_CONTRAST;

    this.applyContrast();
    return this;
  }

  public getContrast(): Contrast {
    return this.contrast;
  }

  private setDefault(contrast: Contrast): this {
    this.localStorageManager.setItem<Contrast>(ContrastManager.LOCAL_STORAGE_KEY, contrast);

    return this;
  }

  private applyContrast(): this {
    const effectiveContrast = this.getEffectiveContrast();
    document.documentElement.setAttribute(ContrastManager.DATA_NAME, effectiveContrast);

    return this;
  }

  private determineInitialContrast(): Contrast {
    const storedContrast = this.localStorageManager.getItem<Contrast>(ContrastManager.LOCAL_STORAGE_KEY);
    if (storedContrast) {
      return storedContrast;
    }

    this.setDefault(ContrastManager.FALLBACK_CONTRAST);

    return ContrastManager.FALLBACK_CONTRAST;
  }

  private getEffectiveContrast(): Contrast {
    if (this.contrast === Contrast.SYSTEM) {
      const prefersMoreContrast = window.matchMedia('(prefers-contrast: more)').matches;
      const prefersLessContrast = window.matchMedia('(prefers-contrast: less)').matches;

      if (prefersMoreContrast) {
        return Contrast.MORE;
      }

      if (prefersLessContrast) {
        return Contrast.LESS;
      }

      return Contrast.SYSTEM;
    }

    return this.contrast;
  }
}
