import { createDirectus, readItem, readItems, readSingleton, rest } from '@directus/sdk';
import type { IDirectusCardsGroup, IDirectusConfig, TLanguage } from '@tousinclus/types';
import { isValidUrl } from '../../utils/isValidUrl';
import { cardsGroupQuery } from './queries/cardsGroupQuery';

class DirectusService {
  private readonly directusClient;
  private readonly directusBaseUrl = isValidUrl(window.env.DIRECTUS_URL)
  ? window.env.DIRECTUS_URL
  : 'http://127.0.0.1:3002';
  private _locale: TLanguage = {
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

  async getCardsGroup(id: string): Promise<IDirectusCardsGroup> {
    return this.directusClient.request<IDirectusCardsGroup>(
      readItem('cards_group', id, cardsGroupQuery(this._locale.code)),
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
