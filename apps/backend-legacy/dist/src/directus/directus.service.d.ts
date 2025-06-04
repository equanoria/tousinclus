import type { ICardDTO, IGroupDTO } from './dto/directus.dto';
import { FormatterService } from '../utils/services/formatter.service';
import { ConfigService } from '@nestjs/config';
import { ERole } from '@tousinclus/types';
import { IUserDirectus } from './interface/user.interface';
export declare class DirectusService {
    private readonly formatterService;
    private readonly configService;
    private readonly directusClient;
    constructor(formatterService: FormatterService, configService: ConfigService);
    getDirectusUrl(): string;
    handleCardRequest(languageCode: ICardDTO['requestLanguage'], type: ICardDTO['type'], id: ICardDTO['id']): Promise<Array<unknown>>;
    usersRequest(languageCode: ICardDTO['requestLanguage'], id: ICardDTO['id']): Promise<Record<string, any>[]>;
    situationsRequest(languageCode: ICardDTO['requestLanguage'], id: ICardDTO['id']): Promise<Record<string, any>[]>;
    handleGroupRequest(languageCode: IGroupDTO['requestLanguage'], id: IGroupDTO['id']): Promise<Array<unknown>>;
    handleDeckRequest(languageCode: IGroupDTO['requestLanguage'], id: IGroupDTO['id']): Promise<Array<unknown>>;
    getDeckById(id: IGroupDTO['id']): Promise<Array<unknown>>;
    getDeckDefault(): Promise<number>;
    getReflectionDurationDefault(): Promise<number>;
    languageRequest(): Promise<Array<unknown>>;
    getUserRoles(userId: string): Promise<ERole[]>;
    getFirstLastNameById(createdByIds: string[]): Promise<IUserDirectus[]>;
}
