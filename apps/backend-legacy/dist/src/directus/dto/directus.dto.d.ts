import { ICard, IDeck, IGroup, ITranslation } from '@tousinclus/types';
export declare class ITranslationDTO implements ITranslation {
    requestLanguage: string;
}
export declare class ICardDTO extends ITranslationDTO implements ICard {
    id: number;
    type: 'users' | 'situations';
}
export declare class IGroupDTO extends ITranslationDTO implements IGroup {
    id: number;
}
export declare class IDeckDTO extends ITranslationDTO implements IDeck {
    id: number;
}
