import { createDirectus, readItems, rest } from '@directus/sdk';
import type { TLanguage } from '@tousinclus/types';
import { isValidUrl } from '../utils/isValidUrl';

interface Schema {
  languages: TLanguage[];
}

export class DirectusService {
  private directus;

  public constructor() {
    const directusBaseUrl = isValidUrl(window.env.DIRECTUS_URL)
      ? window.env.DIRECTUS_URL
      : 'http://127.0.0.1:3002';

    this.directus = createDirectus<Schema>(directusBaseUrl).with(rest());
  }

  public async getLanguages(): Promise<TLanguage[]> {
    try {
      return await this.directus.request(readItems('languages'));
    } catch (error) {
      console.error('Cannot get Languages from Directus.', error);
      return [];
    }
  }
}
