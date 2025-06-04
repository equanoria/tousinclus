"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatterService = void 0;
const common_1 = require("@nestjs/common");
let FormatterService = class FormatterService {
    directusUsersFormatter(usersData) {
        return usersData.map((user) => ({
            id: user.id,
            image: user.image,
            handicap_category: {
                icon: user.handicap_category?.icon || null,
                category_name: user.handicap_category?.translations?.[0]?.category_name || null,
            },
            description: user.translations?.[0]?.description || null,
        }));
    }
    directusSituationsFormatter(situationsData) {
        if (Array.isArray(situationsData)) {
            return situationsData.map((situation) => ({
                id: situation.id,
                image: situation.image,
                context: situation.context_translations?.[0]?.context || null,
                description: situation.description_translations?.[0]?.description || null,
            }));
        }
        if (situationsData && typeof situationsData === 'object') {
            return [
                {
                    id: situationsData.id,
                    image: situationsData.image,
                    context: situationsData.context_translations?.[0]?.context || null,
                    description: situationsData.description_translations?.[0]?.description || null,
                },
            ];
        }
        return [];
    }
    directusGroupFormatter(groupData) {
        return Promise.all(groupData.map(async (group) => {
            const usage_situation = group.usage_situation
                ? (await this.directusSituationsFormatter([group.usage_situation]))[0]
                : null;
            const extremeUsers = group.extreme_user.map((extreme) => extreme.cards_users_id);
            const extreme_user = await this.directusUsersFormatter(extremeUsers);
            return {
                id: group.id,
                title: group.translations?.[0]?.title || null,
                usage_situation,
                extreme_user,
            };
        }));
    }
    directusDeckFormatter(deckData) {
        return Promise.all(deckData.map(async (deck) => {
            const formattedGroups = await Promise.all(deck.group.map(async (group) => {
                const formattedGroup = await this.directusGroupFormatter([
                    group.cards_group_id,
                ]);
                return formattedGroup[0];
            }));
            return {
                id: deck.id,
                title: deck.translations?.[0]?.title || null,
                groups: formattedGroups,
            };
        }));
    }
    directusGetDeckByIdFormatter(deckData) {
        if (!Array.isArray(deckData)) {
            console.error('Invalid data format: expected an array.');
            return [];
        }
        return deckData
            .flatMap((deck) => deck.group || [])
            .map((group) => group.cards_group_id?.id)
            .filter((id) => id !== undefined);
    }
    directusLanguageFormatter(languageData) {
        return languageData.map((lang) => ({ code: lang.code }));
    }
};
exports.FormatterService = FormatterService;
exports.FormatterService = FormatterService = __decorate([
    (0, common_1.Injectable)()
], FormatterService);
//# sourceMappingURL=formatter.service.js.map