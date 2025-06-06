import { createDirectus, readItems, readSingleton, rest } from '@directus/sdk';
import type { IDirectusConfig, TLanguage } from '@tousinclus/types';
import { isValidUrl } from '../../utils/isValidUrl';

export interface ICredentials {
  email: string;
  password: string;
}

export class DirectusService {
  protected readonly directusClient;
  protected readonly directusBaseUrl = isValidUrl(window.env.DIRECTUS_URL)
  ? window.env.DIRECTUS_URL
  : 'http://127.0.0.1:3002';
  protected _locale: TLanguage = {
    code: 'fr-FR',
    name: 'Français',
    direction: 'ltr',
  };

  constructor() {
    this.directusClient = createDirectus(this.directusBaseUrl).with(rest());
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
