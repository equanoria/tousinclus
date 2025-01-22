export interface ITranslation {
    languageCode: "en" | "fr";
}

export interface ICard extends ITranslation{
    type: "users" | "situations" | "design-for-all";
    id: number;
}

export interface IGroup extends ITranslation{
    id: number;
}