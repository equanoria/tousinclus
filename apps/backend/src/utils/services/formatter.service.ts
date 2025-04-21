import { Injectable } from '@nestjs/common';

@Injectable()
export class FormatterService {
  // Formatter for better readability of JSON
  // biome-ignore lint/suspicious/noExplicitAny: TODO any type
  directusUsersFormatter(usersData: any) {
    // biome-ignore lint/suspicious/noExplicitAny: TODO any type
    return usersData.map((user: any) => ({
      id: user.id,
      image: user.image,
      handicap_category: {
        icon: user.handicap_category?.icon || null,
        category_name:
          user.handicap_category?.translations?.[0]?.category_name || null,
      },
      description: user.translations?.[0]?.description || null,
    }));
  }

  // biome-ignore lint/suspicious/noExplicitAny: TODO any type
  directusSituationsFormatter(situationsData: any) {
    if (Array.isArray(situationsData)) {
      // biome-ignore lint/suspicious/noExplicitAny: TODO any type
      return situationsData.map((situation: any) => ({
        id: situation.id,
        image: situation.image,
        context: situation.context_translations?.[0]?.context || null,
        description:
          situation.description_translations?.[0]?.description || null,
      }));
    }

    if (situationsData && typeof situationsData === 'object') {
      // If it's a single object, format it directly
      return {
        id: situationsData.id,
        image: situationsData.image,
        context: situationsData.context_translations?.[0]?.context || null,
        description:
          situationsData.description_translations?.[0]?.description || null,
      };
    }
    return null; // If the data is null or invalid
  }

  // Formatter for groups
  // biome-ignore lint/suspicious/noExplicitAny: TODO any type
  directusGroupFormatter(groupData: any) {
    return Promise.all(
      // biome-ignore lint/suspicious/noExplicitAny: TODO any type
      groupData.map(async (group: any) => {
        // Formatting of usage_situation
        const usage_situation = group.usage_situation
          ? (await this.directusSituationsFormatter([group.usage_situation]))[0]
          : null;

        // Extraction of extreme users
        const extremeUsers = group.extreme_user.map(
          // biome-ignore lint/suspicious/noExplicitAny: TODO any type
          (extreme: any) => extreme.cards_users_id,
        );

        // Formatting of extreme users
        const extreme_user = await this.directusUsersFormatter(extremeUsers);

        return {
          id: group.id,
          title: group.translations?.[0]?.title || null,
          usage_situation,
          extreme_user,
        };
      }),
    );
  }

  // Formatter for decks
  // biome-ignore lint/suspicious/noExplicitAny: TODO any type
  directusDeckFormatter(deckData: any) {
    return Promise.all(
      // biome-ignore lint/suspicious/noExplicitAny: TODO any type
      deckData.map(async (deck: any) => {
        // Processing groups in the deck
        const formattedGroups = await Promise.all(
          // biome-ignore lint/suspicious/noExplicitAny: TODO any type
          deck.group.map(async (group: any) => {
            const formattedGroup = await this.directusGroupFormatter([
              group.cards_group_id,
            ]);
            return formattedGroup[0]; // `groupFormatter` returns an array, we take the first element
          }),
        );

        return {
          id: deck.id,
          title: deck.translations?.[0]?.title || null, // Deck title
          groups: formattedGroups, // Formatted Groups
        };
      }),
    );
  }

  // Formatter for decks
  // biome-ignore lint/suspicious/noExplicitAny: TODO any type
  directusGetDeckByIdFormatter(deckData: any) {
    if (!Array.isArray(deckData)) {
      console.error('Invalid data format: expected an array.');
      return [];
    }

    return deckData
      .flatMap((deck) => deck.group || []) // Récupère tous les groupes
      .map((group) => group.id) // Extrait uniquement les IDs
      .filter((id) => id !== undefined); // Filtre les valeurs undefined au cas où
  }

  // Formatter for language
  // biome-ignore lint/suspicious/noExplicitAny: TODO any type
  directusLanguageFormatter(languageData: any[]): string[] {
    return languageData.map((lang) => lang.code);
  }
}
