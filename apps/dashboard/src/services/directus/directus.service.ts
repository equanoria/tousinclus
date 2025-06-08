import { authentication, type AuthenticationData, createDirectus, readItems, readSingleton, rest } from '@directus/sdk';
import type { IDirectusConfig, TLanguage } from '@tousinclus/types';
import { isValidUrl } from '../../utils/isValidUrl';
import { localStorageManager } from '@tousinclus/managers';

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
  private readonly directusBaseUrl = isValidUrl(window.env.DIRECTUS_URL)
  ? window.env.DIRECTUS_URL
  : 'http://localhost:3002';
  private _locale: TLanguage = {
    code: 'fr-FR',
    name: 'Français',
    direction: 'ltr',
  };

  constructor() {
    this.directusClient = createDirectus(this.directusBaseUrl).with(rest()).with(authentication('json', { storage }));
  }

  async getLanguages(): Promise<TLanguage[]> {
    return await this.directusClient.request<TLanguage[]>(readItems('languages'));
  }

  async getConfig(): Promise<IDirectusConfig> {
    return await this.directusClient.request<IDirectusConfig>(
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

  getAssetUrl(id: string): string {
    return `${this.directusBaseUrl}/assets/${id}`;
  }

  set locale(locale: TLanguage) {
    this._locale = locale;
  }
}

export const directusService = new DirectusService();
