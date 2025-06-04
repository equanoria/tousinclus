"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectusService = void 0;
const common_1 = require("@nestjs/common");
const formatter_service_1 = require("../utils/services/formatter.service");
const sdk_1 = require("@directus/sdk");
const config_1 = require("@nestjs/config");
const types_1 = require("@tousinclus/types");
let DirectusService = class DirectusService {
    constructor(formatterService, configService) {
        this.formatterService = formatterService;
        this.configService = configService;
        this.directusClient = (0, sdk_1.createDirectus)(this.getDirectusUrl())
            .with((0, sdk_1.staticToken)(this.configService.getOrThrow('DIRECTUS_ADMIN_TOKEN')))
            .with((0, sdk_1.rest)());
    }
    getDirectusUrl() {
        const hostname = this.configService.getOrThrow('DIRECTUS_HOSTNAME');
        const port = this.configService.get('DIRECTUS_PORT');
        const url = new URL(`http://${hostname}`);
        if (port) {
            url.port = port;
        }
        return url.toString();
    }
    async handleCardRequest(languageCode, type, id) {
        try {
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
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async usersRequest(languageCode, id) {
        const filter = {};
        if (id !== null) {
            filter.id = { _eq: id };
        }
        let usersData = await this.directusClient.request((0, sdk_1.readItems)('cards_users', {
            filter,
            deep: {
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
            fields: [
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
        }));
        usersData = this.formatterService.directusUsersFormatter(usersData);
        return usersData;
    }
    async situationsRequest(languageCode, id) {
        const filter = {};
        if (id !== null) {
            filter.id = { _eq: id };
        }
        let situationsData = await this.directusClient.request((0, sdk_1.readItems)('cards_situations', {
            filter,
            deep: {
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
            fields: [
                'id',
                'image',
                {
                    context_translations: ['context'],
                },
                {
                    description_translations: ['description'],
                },
            ],
        }));
        situationsData =
            this.formatterService.directusSituationsFormatter(situationsData);
        return situationsData;
    }
    async handleGroupRequest(languageCode, id) {
        try {
            const filter = {};
            if (id !== null) {
                filter.id = { _eq: id };
            }
            let groupData = await this.directusClient.request((0, sdk_1.readItems)('cards_group', {
                filter,
                deep: {
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
            }));
            groupData = await this.formatterService.directusGroupFormatter(groupData);
            return groupData;
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async handleDeckRequest(languageCode, id) {
        try {
            const filter = {};
            if (id !== null) {
                filter.id = { _eq: id };
            }
            let deckData = await this.directusClient.request((0, sdk_1.readItems)('decks', {
                filter,
                deep: {
                    translations: {
                        _filter: {
                            _and: [
                                {
                                    languages_code: { _eq: languageCode },
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
            }));
            deckData = await this.formatterService.directusDeckFormatter(deckData);
            return deckData;
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async getDeckById(id) {
        try {
            const filter = {};
            if (id !== null) {
                filter.id = { _eq: id };
            }
            let deckData = await this.directusClient.request((0, sdk_1.readItems)('decks', {
                filter,
                fields: [
                    'id',
                    {
                        group: [
                            'id',
                            {
                                cards_group_id: ['id'],
                            },
                        ],
                    },
                    {
                        translations: ['title'],
                    },
                ],
            }));
            deckData = this.formatterService.directusGetDeckByIdFormatter(deckData);
            return deckData;
        }
        catch (error) {
            return error;
        }
    }
    async getDeckDefault() {
        try {
            const deckData = await this.directusClient.request((0, sdk_1.readItems)('config', {
                fields: ['deck_default'],
            }));
            return deckData[0]?.deck_default;
        }
        catch (error) {
            throw new Error(`Failed to fetch deck default: ${error}`);
        }
    }
    async getReflectionDurationDefault() {
        try {
            const reflectionDuration = await this.directusClient.request((0, sdk_1.readItems)('config', {
                fields: ['reflection_duration_default'],
            }));
            return reflectionDuration[0]?.duration;
        }
        catch (error) {
            throw new Error(`Failed to fetch reflection duration default: ${error}`);
        }
    }
    async languageRequest() {
        try {
            let languageData = await this.directusClient.request((0, sdk_1.readItems)('languages'));
            languageData =
                this.formatterService.directusLanguageFormatter(languageData);
            return languageData;
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async getUserRoles(userId) {
        const roles = await this.directusClient.request((0, sdk_1.readRoles)({
            fields: ['name'],
            filter: {
                users: { id: { _eq: userId } },
            },
        }));
        return roles
            .map((role) => role.name)
            .filter((roleName) => Object.values(types_1.ERole).includes(roleName));
    }
    async getFirstLastNameById(createdByIds) {
        const query_object = {
            filter: {
                id: {
                    _in: createdByIds,
                },
            },
            fields: ['first_name', 'last_name', 'id'],
        };
        return await this.directusClient.request((0, sdk_1.readUsers)(query_object));
    }
};
exports.DirectusService = DirectusService;
exports.DirectusService = DirectusService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [formatter_service_1.FormatterService,
        config_1.ConfigService])
], DirectusService);
//# sourceMappingURL=directus.service.js.map