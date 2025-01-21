import { Injectable } from '@nestjs/common';
import { ICard, IGroup } from './interfaces/directus.interface';
import { readItems } from '@directus/sdk';

const language: Object = {
    en: "en-US",
    fr: "fr-FR"
};

// ! Différencier les CardRequest

@Injectable()
export class DirectusService {

    // ========== CARD ==========
    async handleCardRequest(client: any, languageCode: ICard['languageCode'], type: ICard['type'], id: ICard['id']): Promise<Array<unknown>> {
        try {
            const filter: any = {};

            // Ajoute le filtre pour `id` uniquement si `id` n'est pas null
            if (id !== null) {
                filter.id = { _eq: id };
            }

            const result = await client.request(
                readItems<any, any, any>(`cards_${type}`, {
                    filter,
                    deep: {
                        translations: {
                            _filter: {
                                _and: [
                                    {
                                        languages_code: { _eq: language[languageCode] }, // Choisie la langue
                                    },
                                ],
                            },
                        },
                    },
                    fields: [
                        '*',        // "*" obligatoire car champs exclusif au type de carte
                        { 
                            translations: ['description'] 
                        }
                    ],
                })
            );

            return result;
        } catch (error) {
            throw new Error(
                error,
            );
        }
    }

    // ========== GROUP ==========
    async handleGroupRequest(client: any, languageCode: IGroup['languageCode'], id: IGroup['id']): Promise<Array<unknown>> {
        try {

            const filter: any = {};

            // Ajoute le filtre pour `id` uniquement si `id` n'est pas null
            if (id !== null) {
                filter.id = { _eq: id };
            }

            const result = await client.request(
                readItems<any, any, any>(`cards_group`, {
                    filter,
                    deep: {         // 
                        translations: {
                            _filter: {
                                _and: [
                                    {
                                        languages_code: { _eq: language[languageCode] }, // Choisie la langue
                                    },
                                ],
                            },
                        },
                        usage_situation: {
                            
                        },
                        extreme_user: {
                            cards_users_id: {
                                handicap_category: {
                                    translations: {
                                        _filter: {
                                            languages_code: { _eq: language[languageCode] }, // Choisie la langue
                                        },
                                    },
                                },
                                translations: {
                                    _filter: {
                                        languages_code: { _eq: language[languageCode] }, // Choisie la langue
                                    },
                                },
                            },
                        },
                    },
                    fields: [
                        'usage_situation',
                        {
                            translations: ['title'],
                            extreme_user: [
                                {
                                    cards_users_id: [
                                        {
                                            handicap_category: [
                                                {
                                                    translations: ['category_name'],
                                                },
                                            ],
                                        },
                                        'image',
                                        { 
                                            translations: [
                                                'description',

                                            ] 
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                })
            );

            return result;
        } catch (error) {
            throw new Error(
                error,
            );
        }
    }
}