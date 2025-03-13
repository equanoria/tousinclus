import { BadRequestException, Injectable } from '@nestjs/common';
import { CacheService } from '../../cache/cache.service';
import { DirectusService } from '../../directus/directus.service';
import { ITranslationDTO } from '../../directus/dto/directus.dto';

@Injectable()
export class LanguageService {
  private readonly LANGUAGE_CODE_TTL = 86400;

  constructor(
    private readonly cacheService: CacheService,
    private readonly directusService: DirectusService,
  ) {}

  async getPreferredLanguage(
    acceptLanguage: ITranslationDTO['requestLanguage'],
    // biome-ignore lint/suspicious/noExplicitAny: TODO any type
    client: any,
  ): Promise<string> {
    if (!acceptLanguage) {
      throw new BadRequestException('Accept-Language header is missing');
    }

    // First, check in the cache
    let cachedLanguages =
      await this.cacheService.getCache<string[]>('languages');

    // If not found, retrieve and store the languages
    if (!cachedLanguages?.length) {
      cachedLanguages = (await this.directusService.languageRequest(
        client,
      )) as string[];
      await this.cacheService.setCache(
        'languages',
        cachedLanguages,
        this.LANGUAGE_CODE_TTL,
      );
    }

    // Check if the requested language is supported
    if (!cachedLanguages.includes(acceptLanguage)) {
      throw new BadRequestException(`Unsupported language: ${acceptLanguage}`);
    }

    return acceptLanguage;
  }
}
