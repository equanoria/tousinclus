export declare class FormatterService {
    directusUsersFormatter(usersData: any): any;
    directusSituationsFormatter(situationsData: any): {
        id: any;
        image: any;
        context: any;
        description: any;
    }[];
    directusGroupFormatter(groupData: any): Promise<any[]>;
    directusDeckFormatter(deckData: any): Promise<any[]>;
    directusGetDeckByIdFormatter(deckData: any): any[];
    directusLanguageFormatter(languageData: any[]): Record<string, any>[];
}
