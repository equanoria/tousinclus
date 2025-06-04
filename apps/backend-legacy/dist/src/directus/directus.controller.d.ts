import { DirectusService } from './directus.service';
import { ICardDTO, IGroupDTO, IDeckDTO } from './dto/directus.dto';
import { LanguageService } from '../utils/services/language.service';
export declare class DirectusController {
    private readonly directusService;
    private readonly languageService;
    constructor(directusService: DirectusService, languageService: LanguageService);
    getOneCard(requestLanguage: ICardDTO['requestLanguage'], type: ICardDTO['type'], id: ICardDTO['id']): Promise<unknown>;
    getAllCard(requestLanguage: ICardDTO['requestLanguage'], type: ICardDTO['type']): Promise<unknown>;
    getOneGroup(requestLanguage: ICardDTO['requestLanguage'], id: IGroupDTO['id']): Promise<unknown>;
    getAllGroup(requestLanguage: IGroupDTO['requestLanguage']): Promise<unknown>;
    getOneDeck(requestLanguage: IDeckDTO['requestLanguage'], id: IDeckDTO['id']): Promise<unknown>;
    getAllDeck(requestLanguage: IDeckDTO['requestLanguage']): Promise<unknown>;
}
