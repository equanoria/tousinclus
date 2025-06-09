import {
  createDirectus,
  readItem,
  readItems,
  readSingleton,
  rest,
} from '@directus/sdk';
import type {
  IDirectusCardsGroup,
  IDirectusConfig,
  TLanguage,
} from '@tousinclus/types';
import { urlValidator } from '../../utils/urlValidator';
import { cardsGroupQuery } from './queries/cardsGroupQuery';

class DirectusService {
  private readonly directusClient;
  private readonly directusUrl = urlValidator(
    window.env.DIRECTUS_URL,
    'http://127.0.0.1:3002',
  );
  private _locale: TLanguage = {
    code: 'fr-FR',
    name: 'Français',
    direction: 'ltr',
  };

  constructor() {
    this.directusClient = createDirectus(this.directusUrl.toString()).with(
      rest(),
    );
  }

  async getLanguages(): Promise<TLanguage[]> {
    return this.directusClient.request<TLanguage[]>(
      readItems('languages'),
    );
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

  async getCardsGroup(id: number): Promise<IDirectusCardsGroup> {
    return this.directusClient.request<IDirectusCardsGroup>(
      readItem('cards_group', id, cardsGroupQuery(this._locale.code)),
    );
  }

  getAssetUrl(id: string): string {
    return `${this.directusUrl}assets/${id}`;
  }

  set locale(locale: TLanguage) {
    this._locale = locale;
  }
}

export const directusService = new DirectusService();
