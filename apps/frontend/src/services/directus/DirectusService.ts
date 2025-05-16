import { createDirectus, readItem, readItems, readSingleton, rest } from '@directus/sdk';
import type { IDirectusCardsGroup, IDirectusConfig, TLanguage } from '@tousinclus/types';
import { isValidUrl } from '../../utils/isValidUrl';
import { cardsGroupQuery } from './queries/cardsGroupQuery';

export class DirectusService {
  private readonly directusClient;
  private readonly directusBaseUrl = isValidUrl(window.env.DIRECTUS_URL)
  ? window.env.DIRECTUS_URL
  : 'http://127.0.0.1:3002';

  public constructor() {
    this.directusClient = createDirectus(this.directusBaseUrl).with(rest());
  }

  public async getLanguages(): Promise<TLanguage[]> {
    return await this.directusClient.request<TLanguage[]>(readItems('languages'));
  }

  public async getConfig(locale: TLanguage): Promise<IDirectusConfig> {
    return await this.directusClient.request<IDirectusConfig>(
      readSingleton('config', {
        fields: ['*', 'translations.*'],
        deep: {
          translations: {
            _filter: {
              languages_code: { _eq: locale.code },
            },
          },
        },
      }),
    );
  }

  public async getCardsGroup(id: string, locale: TLanguage): Promise<IDirectusCardsGroup> {
    return this.directusClient.request<IDirectusCardsGroup>(
      readItem('cards_group', id, cardsGroupQuery(locale.code)),
    );
  }

  public getAssetUrl(id: string): string {
    return `${this.directusBaseUrl}/assets/${id}`;
  }
}
