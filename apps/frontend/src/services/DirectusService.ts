import { createDirectus, readItem, readItems, rest } from '@directus/sdk';
import type { TLanguage } from '@tousinclus/types';
import { isValidUrl } from '../utils/isValidUrl';

export class DirectusService {
  private readonly directusClient;

  public constructor() {
    const directusBaseUrl = isValidUrl(window.env.DIRECTUS_URL)
    ? window.env.DIRECTUS_URL
    : 'http://127.0.0.1:3002';

    this.directusClient = createDirectus(directusBaseUrl).with(rest());
  }

  public async getLanguages(): Promise<TLanguage[]> {
    try {
      return await this.directusClient.request<TLanguage[]>(readItems('languages'));
    } catch (error) {
      console.error('Cannot get Languages from Directus.', error);
      return [];
    }
  }

  public async getCardsGroup(id: string): Promise<unknown> {
    return this.directusClient.request(
      readItem('cards_groups', id)
    );
  }
}
