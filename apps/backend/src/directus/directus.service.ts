import { Injectable } from '@nestjs/common';
import type { ICard, IGroup } from './interfaces/directus.interface';
import type { FormatterService } from './formatter.service';
import { readItems } from '@directus/sdk';

const language: object = {
  en: 'en-US',
  fr: 'fr-FR',
};

@Injectable()
export class DirectusService {
  constructor(private readonly formatterService: FormatterService) {}

  // ========== CARD ==========
  async handleCardRequest(
    client: any,
    languageCode: ICard['languageCode'],
    type: ICard['type'],
    id: ICard['id'],
  ): Promise<Array<unknown>> {
    try {
      let result;

      switch (type) {
        case 'users':
          result = await this.usersRequest(client, languageCode, id);
          break;
        case 'situations':
          result = await this.situationsRequest(client, languageCode, id);
          break;
        case 'design-for-all':
          result = await this.designRequest(client, languageCode, id);
          break;
        default:
          throw new Error(`Unknown type: ${type}`);
      }

      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  // Card Request & formatter Function
  async usersRequest(
    client: any,
    languageCode: ICard['languageCode'],
    id: ICard['id'],
  ) {
    const filter: any = {};

    // Ajoute le filtre pour `id` uniquement si `id` n'est pas null
    if (id !== null) {
      filter.id = { _eq: id };
    }

    // Fais une request explicitement pour les users ( permet de filtrer les champs )
    let usersData = await client.request(
      readItems<any, any, any>('cards_users', {
        filter,
        deep: {
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
        fields: [
          // Permet de trier les champs que l'on veut
          {
            handicap_category: [
              'icon',
              {
                translations: ['category_name'],
              },
            ],
          },
          'image',
          {
            translations: ['description'],
          },
        ],
      }),
    );

    // Formate les données reçu
    usersData = this.formatterService.usersFormatter(usersData);

    return usersData;
  }

  async situationsRequest(
    client: any,
    languageCode: ICard['languageCode'],
    id: ICard['id'],
  ) {
    const filter: any = {};

    // Ajoute le filtre pour `id` uniquement si `id` n'est pas null
    if (id !== null) {
      filter.id = { _eq: id };
    }

    // Fais une request explicitement pour les situations ( permet de filtrer les champs )
    let situationsData = await client.request(
      readItems<any, any, any>(`cards_situations`, {
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
          context_translations: {
            _filter: {
              languages_code: { _eq: language[languageCode] }, // Choisie la langue
            },
          },
          description_translations: {
            _filter: {
              languages_code: { _eq: language[languageCode] }, // Choisie la langue
            },
          },
        },
        fields: [
          // Permet de trier les champs que l'on veut
          'image',
          {
            context_translations: ['context'],
          },
          {
            description_translations: ['description'],
          },
        ],
      }),
    );

    // Formate les données reçu
    situationsData = this.formatterService.situationsFormatter(situationsData);

    return situationsData;
  }

  async designRequest(
    client: any,
    languageCode: ICard['languageCode'],
    id: ICard['id'],
  ) {
    const filter: any = {};

    // Ajoute le filtre pour `id` uniquement si `id` n'est pas null
    if (id !== null) {
      filter.id = { _eq: id };
    }

    // Fais une request explicitement pour les situations ( permet de filtrer les champs )
    let designData = await client.request(
      readItems<any, any, any>(`cards_design_for_all`, {
        filter,
        deep: {
          principle_category: {
            translations: {
              _filter: {
                languages_code: { _eq: language[languageCode] }, // Choisie la langue
              },
            },
          },
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
          // Permet de trier les champs que l'on veut
          'image',
          {
            principle_category: [
              'icon',
              {
                translations: ['category_name'],
              },
            ],
          },
          {
            translations: ['description'],
          },
        ],
      }),
    );

    // Formate les données reçu
    designData = this.formatterService.designFormatter(designData);

    return designData;
  }

  // ========== GROUP ==========
  async handleGroupRequest(
    client: any,
    languageCode: IGroup['languageCode'],
    id: IGroup['id'],
  ): Promise<Array<unknown>> {
    try {
      const filter: any = {};

      // Ajoute le filtre pour `id` uniquement si `id` n'est pas null
      if (id !== null) {
        filter.id = { _eq: id };
      }

      // Fais une request pour les groups ( permet de filtrer les champs )
      let groupData = await client.request(
        readItems<any, any, any>(`cards_group`, {
          filter,
          deep: {
            //
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
              translations: {
                _filter: {
                  _and: [
                    {
                      languages_code: { _eq: language[languageCode] }, // Choisie la langue
                    },
                  ],
                },
              },
              context_translations: {
                _filter: {
                  languages_code: { _eq: language[languageCode] }, // Choisie la langue
                },
              },
              description_translations: {
                _filter: {
                  languages_code: { _eq: language[languageCode] }, // Choisie la langue
                },
              },
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
            {
              usage_situation: [
                'image',
                {
                  context_translations: ['context'],
                },
                {
                  description_translations: ['description'],
                },
              ],
            },
            {
              translations: ['title'],
              extreme_user: [
                {
                  cards_users_id: [
                    {
                      handicap_category: [
                        'icon',
                        {
                          translations: ['category_name'],
                        },
                      ],
                    },
                    'image',
                    {
                      translations: ['description'],
                    },
                  ],
                },
              ],
            },
          ],
        }),
      );

      // Formate les données reçu
      groupData = this.formatterService.groupFormatter(groupData);

      return groupData;
    } catch (error) {
      throw new Error(error);
    }
  }

  // ========== DECK ==========
  async handleDeckRequest(
    client: any,
    languageCode: IGroup['languageCode'],
    id: IGroup['id'],
  ): Promise<Array<unknown>> {
    try {
      const filter: any = {};

      // Ajoute le filtre pour `id` uniquement si `id` n'est pas null
      if (id !== null) {
        filter.id = { _eq: id };
      }

      // Fais une request pour les decks ( permet de filtrer les champs )
      let groupData = await client.request(
        readItems<any, any, any>(`decks`, {
          filter,
          deep: {
            //
            translations: {
              _filter: {
                _and: [
                  {
                    languages_code: { _eq: language[languageCode] }, // Choisie la langue
                  },
                ],
              },
            },
            group: {
              translations: {
                _filter: {
                  _and: [
                    {
                      languages_code: { _eq: language[languageCode] },
                    },
                  ],
                },
              },
              cards_group_id: {
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
                  translations: {
                    _filter: {
                      _and: [
                        {
                          languages_code: { _eq: language[languageCode] }, // Choisie la langue
                        },
                      ],
                    },
                  },
                  context_translations: {
                    _filter: {
                      languages_code: { _eq: language[languageCode] }, // Choisie la langue
                    },
                  },
                  description_translations: {
                    _filter: {
                      languages_code: { _eq: language[languageCode] }, // Choisie la langue
                    },
                  },
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
            },
          },
          fields: [
            {
              group: [
                {
                  cards_group_id: [
                    {
                      usage_situation: [
                        'image',
                        {
                          context_translations: ['context'],
                        },
                        {
                          description_translations: ['description'],
                        },
                      ],
                    },
                    {
                      translations: ['title'],
                      extreme_user: [
                        {
                          cards_users_id: [
                            {
                              handicap_category: [
                                'icon',
                                {
                                  translations: ['category_name'],
                                },
                              ],
                            },
                            'image',
                            {
                              translations: ['description'],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              translations: ['title'],
            },
          ],
        }),
      );

      // Formate les données reçu
      groupData = this.formatterService.deckFormatter(groupData);

      return groupData;
    } catch (error) {
      throw new Error(error);
    }
  }
}
