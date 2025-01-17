import { Injectable } from '@nestjs/common';
import { ICard } from './interfaces/directus.interface';
import { readItems } from '@directus/sdk';

@Injectable()
export class DirectusService {

    async handleCardRequest(client: any, languageCode: ICard['languageCode'], type: ICard['type'], id: ICard['id']): Promise<Array<unknown>> {
        try {
            const language: Object = {
                en: "en-US",
                fr: "fr-FR"
            };
            const filter: any = {};

            // const result = client.request(readItems('cards_situations'));
            // const result = client.request(readItems('cards_users'));

            // Ajoute le filtre pour `id` uniquement si `id` n'est pas null
            if (id !== null) {
                filter.id = { _eq: id };
            }

            const result = await client.request(
                readItems<any, any, any>(`cards_${type}`, {
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
                    },
                    fields: ['*', { translations: ['*'] }],
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