interface IConfigTranslation {
    cards_designing_all_name: string;
    cards_situation_name: string;
    cards_user_name: string;
    config_id: string;
    id: string;
    languages_code: string;
    legal_notice: string;
    rules_connexion_phase: string;
    rules_debating_phase: string;
    rules_reflexion_phase: string;
}
export interface IConfig {
    cards_designing_all_color: string;
    cards_situation_color: string;
    cards_user_color: string;
    date_updated: string;
    deck_default: string;
    id: string;
    translations: IConfigTranslation[];
}
export {};
//# sourceMappingURL=config.d.ts.map