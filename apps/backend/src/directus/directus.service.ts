import { Injectable } from '@nestjs/common';
import type { ICardDTO, IGroupDTO } from './dto/directus.dto';
import { FormatterService } from '../utils/services/formatter.service';
import { createDirectus, readItems, rest, staticToken } from '@directus/sdk';

@Injectable()
export class DirectusService {
  // For information directusClient type is DirectusClient<unknown> & RestClient<unknown> & StaticTokenClient<unknown>
  private readonly directusClient = createDirectus(
    process.env.DIRECTUS_URL || 'http://127.0.0.1:3002',
  )
    .with(
      staticToken(
        process.env.DIRECTUS_ADMIN_TOKEN || 'ssHmmuIXSHHbnsxsTTKeSqIuc1e66diF',
      ),
    )
    .with(rest());

  constructor(private readonly formatterService: FormatterService) {}

  // ========== CARD ==========
  async handleCardRequest(
    languageCode: ICardDTO['requestLanguage'],
    type: ICardDTO['type'],
    id: ICardDTO['id'],
  ): Promise<Array<unknown>> {
    try {
      // biome-ignore lint/suspicious/noImplicitAnyLet: TODO any type
      let result;

      switch (type) {
        case 'users':
          result = await this.usersRequest(languageCode, id);
          break;
        case 'situations':
          result = await this.situationsRequest(languageCode, id);
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
    let usersData = await this.directusClient.request(
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
    let situationsData = await this.directusClient.request(
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
      let groupData = await this.directusClient.request(
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
      groupData = await this.formatterService.directusGroupFormatter(groupData);

      return groupData;
    } catch (error) {
      throw new Error(error);
    }
  }

  // ========== DECK ==========
  async handleDeckRequest(
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
      let deckData = await this.directusClient.request(
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
      deckData = await this.formatterService.directusDeckFormatter(deckData);

      return deckData;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getDeckById(id: IGroupDTO['id']): Promise<Array<unknown>> {
    try {
      // biome-ignore lint/suspicious/noExplicitAny: TODO any type
      const filter: any = {};

      // Add the filter for `id` only if `id` is not null
      if (id !== null) {
        filter.id = { _eq: id };
      }
      // Make an explicit request for users (allows filtering fields)
      let deckData = await this.directusClient.request(
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

  async getDeckDefault(): Promise<number> {
    try {
      // Make an explicit request for users (allows filtering fields)
      const deckData = await this.directusClient.request(
        // biome-ignore lint/suspicious/noExplicitAny: TODO any type
        readItems<any, any, any>('config', {
          fields: ['deck_default'],
        }),
      );

      return deckData[0]?.deck_default;
    } catch (error) {
      throw new Error(`Failed to fetch deck default: ${error}`);
    }
  }

  async getReflectionDurationDefault(): Promise<number> {
    try {
      // Make an explicit request for users (allows filtering fields)
      const reflectionDuration = await this.directusClient.request(
        // biome-ignore lint/suspicious/noExplicitAny: TODO any type
        readItems<any, any, any>('config', {
          fields: ['reflection_duration_default'],
        }),
      );

      return reflectionDuration[0]?.duration;
    } catch (error) {
      throw new Error(`Failed to fetch reflection duration default: ${error}`);
    }
  }

  // ========== LANGUAGES ==========
  async languageRequest(): Promise<Array<unknown>> {
    try {
      // Get Language Data
      let languageData = await this.directusClient.request(
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
