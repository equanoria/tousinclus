import {
  createDirectus,
  readItems,
  readRoles,
  rest,
  staticToken,
} from '@directus/sdk';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ERole } from '@tousinclus/types';

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

  async getUserRoles(id: string): Promise<ERole[]> {
    const roles = await this.directusClient.request(
      readRoles({
        fields: ['name'],
        filter: {
          users: { id: { _eq: id } },
        },
      }),
    );

    return roles
      .map((role) => role.name)
      .filter((roleName): roleName is ERole =>
        Object.values(ERole).includes(roleName as ERole),
      );
  }
}
