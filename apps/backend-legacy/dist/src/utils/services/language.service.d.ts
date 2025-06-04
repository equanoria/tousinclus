import { DirectusService } from '../../directus/directus.service';
import { ITranslationDTO } from '../../directus/dto/directus.dto';
import { Cache } from 'cache-manager';
export declare class LanguageService {
    private readonly directusService;
    private readonly cacheManager;
    private readonly LANGUAGE_CODE_TTL;
    constructor(directusService: DirectusService, cacheManager: Cache);
    getPreferredLanguage(acceptLanguage: ITranslationDTO['requestLanguage']): Promise<string>;
}
