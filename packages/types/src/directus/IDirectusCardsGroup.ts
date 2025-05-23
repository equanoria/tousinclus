interface TranslationTitle {
  title: string;
}

interface UsageSituationContextTranslation {
  context: string;
}

interface UsageSituationDescriptionTranslation {
  description: string;
}

interface UsageSituation {
  image: string;
  context_translations: UsageSituationContextTranslation[];
  description_translations: UsageSituationDescriptionTranslation[];
}

interface HandicapCategoryTranslation {
  category_name: string;
}

interface HandicapCategory {
  icon: string | null;
  translations: HandicapCategoryTranslation[];
}

interface UserTranslation {
  description: string;
}

interface CardUser {
  id: number;
  image: string;
  translations: UserTranslation[];
  handicap_category: HandicapCategory;
}

export interface ExtremeUser {
  cards_users_id: CardUser;
}

export interface IDirectusCardsGroup {
  id: number;
  translations: TranslationTitle[];
  usage_situation: UsageSituation;
  extreme_user: ExtremeUser[];
}
