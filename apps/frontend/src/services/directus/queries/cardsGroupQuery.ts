export const cardsGroupQuery = (localeCode: string) => {
  return {
    deep: {
      translations: {
        _filter: {
          languages_code: { _eq: localeCode },
        },
      },
      usage_situation: {
        translations: {
          _filter: {
            languages_code: { _eq: localeCode },
          },
        },
        context_translations: {
          _filter: {
            languages_code: { _eq: localeCode },
          },
        },
        description_translations: {
          _filter: {
            languages_code: { _eq: localeCode },
          },
        },
      },
      extreme_user: {
        cards_users_id: {
          handicap_category: {
            translations: {
              _filter: {
                languages_code: { _eq: localeCode },
              },
            },
          },
          translations: {
            _filter: {
              languages_code: { _eq: localeCode },
            },
          },
        },
      },
    },
    fields: [
      'id',
      {
        translations: ['title'],
      },
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
        extreme_user: [
          {
            cards_users_id: [
              'image',
              {
                translations: ['description'],
              },
              {
                handicap_category: [
                  'icon',
                  {
                    translations: ['category_name'],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
}
