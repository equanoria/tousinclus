import { Injectable } from '@nestjs/common';
import type { ICard, IGroup } from './interfaces/directus.interface';
import { FormatterService } from './formatter.service';
import { readItems } from '@directus/sdk';

@Injectable()
export class DirectusService {
  constructor(private readonly formatterService: FormatterService) {}

  // ========== CARD ==========
  async handleCardRequest(
    // biome-ignore lint/suspicious/noExplicitAny: TODO any type
    client: any,
    languageCode: ICard['languageCode'],
    type: ICard['type'],
    id: ICard['id'],
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
    // biome-ignore lint/suspicious/noExplicitAny: TODO any type
    client: any,
    languageCode: ICard['languageCode'],
    id: ICard['id'],
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
    usersData = this.formatterService.usersFormatter(usersData);

    return usersData;
  }

  async situationsRequest(
    // biome-ignore lint/suspicious/noExplicitAny: TODO any type
    client: any,
    languageCode: ICard['languageCode'],
    id: ICard['id'],
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
    situationsData = this.formatterService.situationsFormatter(situationsData);

    return situationsData;
  }

  async designRequest(
    // biome-ignore lint/suspicious/noExplicitAny: TODO any type
    client: any,
    languageCode: ICard['languageCode'],
    id: ICard['id'],
  ) {
    // biome-ignore lint/suspicious/noExplicitAny: TODO any type
    const filter: any = {};

    // Add the filter for `id` only if `id` is not null
    if (id !== null) {
      filter.id = { _eq: id };
    }

    // Make an explicit request for users (allows filtering fields)
    let designData = await client.request(
      // biome-ignore lint/suspicious/noExplicitAny: TODO any type
      readItems<any, any, any>('cards_design_for_all', {
        filter,
        deep: {
          principle_category: {
            translations: {
              _filter: {
                languages_code: { _eq: languageCode }, // Choose language
              },
            },
          },
          translations: {
            _filter: {
              _and: [
                {
                  languages_code: { _eq: languageCode },
                },
              ],
            },
          },
        },
        fields: [
          // Allows filtering the fields we want
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

    // Formatting data
    designData = this.formatterService.designFormatter(designData);

    return designData;
  }

  // ========== GROUP ==========
  async handleGroupRequest(
    // biome-ignore lint/suspicious/noExplicitAny: TODO any type
    client: any,
    languageCode: IGroup['languageCode'],
    id: IGroup['id'],
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
      groupData = this.formatterService.groupFormatter(groupData);

      return groupData;
    } catch (error) {
      throw new Error(error);
    }
  }

  // ========== DECK ==========
  async handleDeckRequest(
    // biome-ignore lint/suspicious/noExplicitAny: TODO any type
    client: any,
    languageCode: IGroup['languageCode'],
    id: IGroup['id'],
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
        readItems<any, any, any>('decks', {
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
      groupData = this.formatterService.deckFormatter(groupData);

      return groupData;
    } catch (error) {
      throw new Error(error);
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
      languageData = this.formatterService.languageFormatter(languageData);

      return languageData;
    } catch (error) {
      throw new Error(error);
    }
  }
}
