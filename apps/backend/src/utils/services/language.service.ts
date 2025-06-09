import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { DirectusService } from '../../directus/directus.service';
import { ITranslationDTO } from '../../directus/dto/directus.dto';

@Injectable()
export class LanguageService {
  private readonly LANGUAGE_CODE_TTL = 86400;

  constructor(
    private readonly directusService: DirectusService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getPreferredLanguage(
    acceptLanguage: ITranslationDTO['requestLanguage'],
  ): Promise<string> {
    if (!acceptLanguage) {
      throw new BadRequestException('Accept-Language header is missing');
    }

    // First, check in the cache
    let cachedLanguages = await this.cacheManager.get<string[]>('languages');

    // If not found, retrieve and store the languages
    if (!cachedLanguages?.length) {
      cachedLanguages =
        (await this.directusService.languageRequest()) as string[];
      await this.cacheManager.set(
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
