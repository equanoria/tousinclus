import { authentication, type AuthenticationData, createDirectus, readItems, readSingleton, rest } from '@directus/sdk';
import type { IDirectusConfig, TLanguage } from '@tousinclus/types';
import { localStorageManager } from '@tousinclus/managers';
import { urlValidator } from '../../utils/urlValidator';

const AUTH_KEY = 'auth';

export const storage: {
  get: () => AuthenticationData | null;
  set: (value: AuthenticationData | null) => void | Promise<void>;
  delete: () => void | Promise<void>;
} = {
  get: () => {
    return localStorageManager.getItem<AuthenticationData>(AUTH_KEY) ?? null;
  },
  set: (value: AuthenticationData | null) => {
    if (!value) {
      localStorageManager.removeItem(AUTH_KEY);
    } else {
      localStorageManager.setItem(AUTH_KEY, value);
    }
  },
  delete: () => {
    localStorageManager.removeItem(AUTH_KEY);
  },
};

class DirectusService {
  readonly directusClient;
  private readonly directusUrl = urlValidator(window.env.DIRECTUS_URL, 'http://localhost:3002');
  private _locale: TLanguage = {
    code: 'fr-FR',
    name: 'Français',
    direction: 'ltr',
  };

  constructor() {
    this.directusClient = createDirectus(this.directusUrl.toString()).with(rest()).with(authentication('json', { storage }));
  }

  async getLanguages(): Promise<TLanguage[]> {
    return this.directusClient.request<TLanguage[]>(readItems('languages'));
  }

  async getConfig(): Promise<IDirectusConfig> {
    return this.directusClient.request<IDirectusConfig>(
      readSingleton('config', {
        fields: ['*', 'translations.*'],
        deep: {
          translations: {
            _filter: {
              languages_code: { _eq: this._locale.code },
            },
          },
        },
      }),
    );
  }

  async getDeckGroups(): Promise<{ id: number }[]> {
    return this.directusClient.request<{ id: number }[]>(
      readItems('decks', {
        fields: ['id'],
      }),
    ); 
  }

  getAssetUrl(id: string): string {
    return `${this.directusUrl}/assets/${id}`;
  }

  set locale(locale: TLanguage) {
    this._locale = locale;
  }

  get resetPasswordUrl(): string {
    return `${this.directusUrl}/admin/reset-password`;
  }

  get url(): string {
    return this.directusUrl.toString();
  }
}

export const directusService = new DirectusService();
