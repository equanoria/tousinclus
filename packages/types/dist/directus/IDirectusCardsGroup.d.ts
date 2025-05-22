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
interface CardsUser {
    id: string;
    image: string;
    translations: UserTranslation[];
    handicap_category: HandicapCategory;
}
interface ExtremeUserEntry {
    cards_users_id: CardsUser;
}
export interface IDirectusCardsGroup {
    id: string;
    translations: TranslationTitle[];
    usage_situation: UsageSituation;
    extreme_user: ExtremeUserEntry[];
}
export {};
//# sourceMappingURL=IDirectusCardsGroup.d.ts.map