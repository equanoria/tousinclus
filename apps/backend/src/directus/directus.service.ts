import { Injectable } from '@nestjs/common';
import type { ICardDTO, IGroupDTO } from './dto/directus.dto';
import { FormatterService } from '../utils/services/formatter.service';
import { readItems } from '@directus/sdk';

@Injectable()
export class DirectusService {
  constructor(private readonly formatterService: FormatterService) {}

  // ========== CARD ==========
  async handleCardRequest(
    // biome-ignore lint/suspicious/noExplicitAny: TODO any type
    client: any,
    languageCode: ICardDTO['requestLanguage'],
    type: ICardDTO['type'],
    id: ICardDTO['id'],
  ): Promise<Array<unknown>> {
    try {
      // biome-ignore lint/suspicious/noImplicitAnyLet: TODO any type
      let result;

      switch (type) {
        case 'users':
          result = await this.usersRequest(client, languageCode, id);
          break;
        case 'situations':
          result = await this.situationsRequest(client, languageCode, id);
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
    // biome-ignore lint/suspicious/noExplicitAny: TODO any type
    client: any,
    languageCode: ICardDTO['requestLanguage'],
    id: ICardDTO['id'],
  ) {
    // biome-ignore lint/suspicious/noExplicitAny: TODO any type
    const filter: any = {};

    // Add the filter for `id` only if `id` is not null
    if (id !== null) {
      filter.id = { _eq: id };
    }

    // Make an explicit request for users (allows filtering fields)
    let usersData = await client.request(
      // biome-ignore lint/suspicious/noExplicitAny: TODO any type
      readItems<any, any, any>('cards_users', {
        filter,
        deep: {
          handicap_category: {
            translations: {
              _filter: {
                languages_code: { _eq: languageCode }, // Choose language
              },
            },
          },
          translations: {
            _filter: {
              languages_code: { _eq: languageCode },
            },
          },
        },
        fields: [
          // Allows filtering the fields we want
          'id',
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

    // Formatting data
    usersData = this.formatterService.directusUsersFormatter(usersData);

    return usersData;
  }

  async situationsRequest(
    // biome-ignore lint/suspicious/noExplicitAny: TODO any type
    client: any,
    languageCode: ICardDTO['requestLanguage'],
    id: ICardDTO['id'],
  ) {
    // biome-ignore lint/suspicious/noExplicitAny: TODO any type
    const filter: any = {};

    // Add the filter for `id` only if `id` is not null
    if (id !== null) {
      filter.id = { _eq: id };
    }

    // Make an explicit request for users (allows filtering fields)
    let situationsData = await client.request(
      // biome-ignore lint/suspicious/noExplicitAny: TODO any type
      readItems<any, any, any>('cards_situations', {
        filter,
        deep: {
          translations: {
            _filter: {
              _and: [
                {
                  languages_code: { _eq: languageCode }, // Choose language
                },
              ],
            },
          },
          context_translations: {
            _filter: {
              languages_code: { _eq: languageCode },
            },
          },
          description_translations: {
            _filter: {
              languages_code: { _eq: languageCode },
            },
          },
        },
        fields: [
          'id',
          // Allows filtering the fields we want
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

    // Formatting data
    situationsData =
      this.formatterService.directusSituationsFormatter(situationsData);

    return situationsData;
  }

  // ========== GROUP ==========
  async handleGroupRequest(
    // biome-ignore lint/suspicious/noExplicitAny: TODO any type
    client: any,
    languageCode: IGroupDTO['requestLanguage'],
    id: IGroupDTO['id'],
  ): Promise<Array<unknown>> {
    try {
      // biome-ignore lint/suspicious/noExplicitAny: TODO any type
      const filter: any = {};

      // Add the filter for `id` only if `id` is not null
      if (id !== null) {
        filter.id = { _eq: id };
      }

      // Make an explicit request for users (allows filtering fields)
      let groupData = await client.request(
        // biome-ignore lint/suspicious/noExplicitAny: TODO any type
        readItems<any, any, any>('cards_group', {
          filter,
          deep: {
            //
            translations: {
              _filter: {
                _and: [
                  {
                    languages_code: { _eq: languageCode }, // Choose language
                  },
                ],
              },
            },
            usage_situation: {
              translations: {
                _filter: {
                  _and: [
                    {
                      languages_code: { _eq: languageCode },
                    },
                  ],
                },
              },
              context_translations: {
                _filter: {
                  languages_code: { _eq: languageCode },
                },
              },
              description_translations: {
                _filter: {
                  languages_code: { _eq: languageCode },
                },
              },
            },
            extreme_user: {
              cards_users_id: {
                handicap_category: {
                  translations: {
                    _filter: {
                      languages_code: { _eq: languageCode },
                    },
                  },
                },
                translations: {
                  _filter: {
                    languages_code: { _eq: languageCode },
                  },
                },
              },
            },
          },
          fields: [
            'id',
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

      // Formatting data
      groupData = this.formatterService.directusGroupFormatter(groupData);

      return groupData;
    } catch (error) {
      throw new Error(error);
    }
  }

  // ========== DECK ==========
  async handleDeckRequest(
    // biome-ignore lint/suspicious/noExplicitAny: TODO any type
    client: any,
    languageCode: IGroupDTO['requestLanguage'],
    id: IGroupDTO['id'],
  ): Promise<Array<unknown>> {
    try {
      // biome-ignore lint/suspicious/noExplicitAny: TODO any type
      const filter: any = {};

      // Add the filter for `id` only if `id` is not null
      if (id !== null) {
        filter.id = { _eq: id };
      }

      // Make an explicit request for users (allows filtering fields)
      let deckData = await client.request(
        // biome-ignore lint/suspicious/noExplicitAny: TODO any type
        readItems<any, any, any>('decks', {
          filter,
          deep: {
            translations: {
              _filter: {
                _and: [
                  {
                    languages_code: { _eq: languageCode }, // Choose language
                  },
                ],
              },
            },
            group: {
              translations: {
                _filter: {
                  _and: [
                    {
                      languages_code: { _eq: languageCode },
                    },
                  ],
                },
              },
              cards_group_id: {
                translations: {
                  _filter: {
                    _and: [
                      {
                        languages_code: { _eq: languageCode },
                      },
                    ],
                  },
                },
                usage_situation: {
                  translations: {
                    _filter: {
                      _and: [
                        {
                          languages_code: { _eq: languageCode },
                        },
                      ],
                    },
                  },
                  context_translations: {
                    _filter: {
                      languages_code: { _eq: languageCode },
                    },
                  },
                  description_translations: {
                    _filter: {
                      languages_code: { _eq: languageCode },
                    },
                  },
                },
                extreme_user: {
                  cards_users_id: {
                    handicap_category: {
                      translations: {
                        _filter: {
                          languages_code: { _eq: languageCode },
                        },
                      },
                    },
                    translations: {
                      _filter: {
                        languages_code: { _eq: languageCode },
                      },
                    },
                  },
                },
              },
            },
          },
          fields: [
            'id',
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

      // Formatting data
      deckData = this.formatterService.directusDeckFormatter(deckData);

      return deckData;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getDeckById(
    // biome-ignore lint/suspicious/noExplicitAny: TODO any type
    client: any,
    id: IGroupDTO['id'],
  ): Promise<Array<unknown>> {
    try {
      // biome-ignore lint/suspicious/noExplicitAny: TODO any type
      const filter: any = {};

      // Add the filter for `id` only if `id` is not null
      if (id !== null) {
        filter.id = { _eq: id };
      }
      // Make an explicit request for users (allows filtering fields)
      let deckData = await client.request(
        // biome-ignore lint/suspicious/noExplicitAny: TODO any type
        readItems<any, any, any>('decks', {
          filter,
          deep: {
            group: {},
          },
          fields: [
            'id',
            {
              group: ['id'],
            },
            {
              translations: ['title'],
            },
          ],
        }),
      );

      // Formatting data
      deckData = this.formatterService.directusGetDeckByIdFormatter(deckData);

      return deckData;
    } catch (error) {
      return error;
    }
  }

  // biome-ignore lint/suspicious/noExplicitAny: TODO any type
  async getDeckDefault(client: any): Promise<number> {
    try {
      // Make an explicit request for users (allows filtering fields)
      const deckData = await client.request(
        // biome-ignore lint/suspicious/noExplicitAny: TODO any type
        readItems<any, any, any>('config', {
          fields: ['deck_default'],
        }),
      );

      return deckData.deck_default;
    } catch (error) {
      return error;
    }
  }

  // ========== LANGUAGES ==========
  async languageRequest(
    // biome-ignore lint/suspicious/noExplicitAny: TODO any type
    client: any,
  ): Promise<Array<unknown>> {
    try {
      // Get Language Data
      let languageData = await client.request(
        // biome-ignore lint/suspicious/noExplicitAny: TODO any type
        readItems<any, any, any>('languages'),
      );

      // Formatter for Language Data
      languageData =
        this.formatterService.directusLanguageFormatter(languageData);

      return languageData;
    } catch (error) {
      throw new Error(error);
    }
  }
}
