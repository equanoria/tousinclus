import { authentication, createDirectus, readItems, rest } from '@directus/sdk';
import type { TLanguage } from '@tousinclus/types';
import { isValidUrl } from '../utils/isValidUrl';

export interface ICredentials {
  email: string;
  password: string;
}

class DirectusService {
  private readonly directusClient;

  public constructor() {
    const directusBaseUrl = isValidUrl(window.env.DIRECTUS_URL)
    ? window.env.DIRECTUS_URL
    : 'http://127.0.0.1:3002';

    this.directusClient = createDirectus(directusBaseUrl).with(rest()).with(authentication());
  }

  public async login({ email, password }: ICredentials): Promise<void> {
    const authenticationData = await this.directusClient.login(email, password);
    console.log('Logged in:', authenticationData);
  }

  public async getLanguages(): Promise<TLanguage[]> {
    try {
      return await this.directusClient.request<TLanguage[]>(readItems('languages'));
    } catch (error) {
      console.error('Cannot get Languages from Directus.', error);
      return [];
    }
  }
}

export const directusService = new DirectusService();
