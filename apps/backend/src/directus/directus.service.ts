import { createDirectus, readItems, rest, staticToken } from '@directus/sdk';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IProperty } from './interfaces/IProperty';
import { IConfig } from './interfaces/IConfig';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class DirectusService {
  private readonly logger = new Logger(DirectusService.name);
  private readonly FALLBACK_LOCALE = 'fr-FR';
  private readonly directusClient = createDirectus(this.getDirectusUrl())
    .with(
      staticToken(
        this.configService.getOrThrow<string>('DIRECTUS_ADMIN_TOKEN'),
      ),
    )
    .with(rest());

  constructor(
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  getDirectusUrl(): string {
    const hostname = this.configService.getOrThrow<string>('DIRECTUS_HOSTNAME');
    const port = this.configService.get<string>('DIRECTUS_PORT');

    const url = new URL(`http://${hostname}`);
    if (port) {
      url.port = port;
    }

    return url.toString();
  }

  async getConfig(): Promise<IConfig> {
    const cacheKey = 'DEFAULT_BOOKING_TIMES';
    const ttl = 24 * 60 * 60; // 24 hours

    let config = await this.cacheManager.get<IConfig>(cacheKey);

    if (!config) {
      try {
        config = await this.directusClient.request<IConfig>(
          readItems('config'),
        );
      } catch (error) {
        this.logger.error('Error fetching config:', error);
        throw error;
      }
    }

    await this.cacheManager.set(cacheKey, config, ttl);

    return config;
  }

  async getLocales(): Promise<{ code: string }[]> {
    const cacheKey = 'LOCALES_AVAILABLE';
    const ttl = 24 * 60 * 60; // 24 hours

    let languages = await this.cacheManager.get<{ code: string }[]>(cacheKey);

    if (!languages) {
      try {
        languages = await this.directusClient.request<{ code: string }[]>(
          readItems('languages'),
        );
        await this.cacheManager.set(cacheKey, languages, ttl);
      } catch (error) {
        this.logger.error('Error fetching languages from Directus:', error);
        throw error;
      }
    }

    return languages;
  }

  private async validateLocale(locale?: string): Promise<string> {
    if (!locale) return this.FALLBACK_LOCALE;

    const locales = await this.getLocales();

    if (!locales.some((lang) => lang.code === locale)) {
      this.logger.error(`Locale ${locale} is not supported.`);
      return this.FALLBACK_LOCALE;
    }

    return locale;
  }

  async getCorrespondingLocale(locale: string): Promise<string> {
    const locales = await this.getLocales();

    let matchingLocale = locales.find((lang) => lang.code === locale);

    if (!matchingLocale) {
      const [languageCode] = locale.split('-');
      matchingLocale = locales.find((lang) =>
        lang.code.startsWith(languageCode),
      );
    }

    if (!matchingLocale) return this.FALLBACK_LOCALE;

    return matchingLocale.code;
  }

  async getPropertyById(id: string, locale?: string): Promise<IProperty> {
    const validatedLocale = await this.validateLocale(locale);

    try {
      const rawProperty = await this.directusClient.request<IProperty>(
        readItems('properties', {
          filter: { beds24id: { _eq: id } },
          limit: 1,
          fields: ['*', { translations: ['*'] }, { locks: ['locks_id.*'] }],
          deep: {
            translations: {
              _filter: {
                _and: [
                  {
                    languages_code: { _eq: validatedLocale },
                  },
                ],
              },
            },
          },
        }),
      );

      const property = rawProperty[0];
      property.locks = property.locks.map(
        (entry: { locks_id: IProperty['locks'] }) => entry.locks_id,
      );

      return property;
    } catch (error) {
      this.logger.error(`Error fetching property with ID ${id}:`, error);
      throw error;
    }
  }
}
