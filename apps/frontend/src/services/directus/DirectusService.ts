import { createDirectus, readItem, readItems, readSingleton, rest } from '@directus/sdk';
import type { IDirectusConfig, TLanguage } from '@tousinclus/types';
import { isValidUrl } from '../../utils/isValidUrl';
import { cardsGroupQuery } from './queries/cardsGroupQuery';

export class DirectusService {
  private readonly directusClient;

  public constructor() {
    const directusBaseUrl = isValidUrl(window.env.DIRECTUS_URL)
    ? window.env.DIRECTUS_URL
    : 'http://127.0.0.1:3002';

    this.directusClient = createDirectus(directusBaseUrl).with(rest());
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

  public async getCardsGroup(id: string, locale: TLanguage): Promise<unknown> {
    return this.directusClient.request(
      readItem('cards_groups', id, cardsGroupQuery(locale.code)),
    );
  }
}
