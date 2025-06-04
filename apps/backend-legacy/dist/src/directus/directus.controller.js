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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectusController = void 0;
const common_1 = require("@nestjs/common");
const directus_service_1 = require("./directus.service");
const language_service_1 = require("../utils/services/language.service");
const swagger_1 = require("@nestjs/swagger");
const response_dto_1 = require("../utils/dto/response.dto");
let DirectusController = class DirectusController {
    constructor(directusService, languageService) {
        this.directusService = directusService;
        this.languageService = languageService;
    }
    async getOneCard(requestLanguage, type, id) {
        const languageCode = await this.languageService.getPreferredLanguage(requestLanguage);
        if (!(type === 'users' || type === 'situations')) {
            throw new common_1.NotFoundException(`Type ${type} don't exist`);
        }
        const card = await this.directusService.handleCardRequest(languageCode, type, id);
        if (!card.length) {
            throw new common_1.NotFoundException(`No card with id : ${id} found`);
        }
        return card;
    }
    async getAllCard(requestLanguage, type) {
        const languageCode = await this.languageService.getPreferredLanguage(requestLanguage);
        if (!(type === 'users' || type === 'situations')) {
            throw new common_1.NotFoundException(`Type ${type} don't exist`);
        }
        const cards = await this.directusService.handleCardRequest(languageCode, type, null);
        if (!cards.length) {
            throw new common_1.NotFoundException(`No card ${type} found, database may be empty`);
        }
        return cards;
    }
    async getOneGroup(requestLanguage, id) {
        const languageCode = await this.languageService.getPreferredLanguage(requestLanguage);
        const group = await this.directusService.handleGroupRequest(languageCode, id);
        if (!group.length) {
            throw new common_1.NotFoundException(`No card group with id : ${id} found`);
        }
        return group;
    }
    async getAllGroup(requestLanguage) {
        const languageCode = await this.languageService.getPreferredLanguage(requestLanguage);
        const group = await this.directusService.handleGroupRequest(languageCode, null);
        if (!group.length) {
            throw new common_1.NotFoundException('No card group found, database may be empty');
        }
        return group;
    }
    async getOneDeck(requestLanguage, id) {
        const languageCode = await this.languageService.getPreferredLanguage(requestLanguage);
        const group = await this.directusService.handleDeckRequest(languageCode, id);
        if (!group.length) {
            throw new common_1.NotFoundException(`No card deck with id : ${id} found`);
        }
        return group;
    }
    async getAllDeck(requestLanguage) {
        const languageCode = await this.languageService.getPreferredLanguage(requestLanguage);
        const group = await this.directusService.handleDeckRequest(languageCode, null);
        if (!group.length) {
            throw new common_1.NotFoundException('No card deck found, database may be empty');
        }
        return group;
    }
};
exports.DirectusController = DirectusController;
__decorate([
    (0, common_1.Get)('card/:type/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a specific card by Type and ID' }),
    (0, swagger_1.ApiHeader)({
        name: 'accept-language',
        required: true,
        enum: ['en-US', 'fr-FR'],
        example: 'en-US',
    }),
    (0, swagger_1.ApiParam)({
        name: 'type',
        description: 'Type of the card',
        enum: ['users', 'situations'],
        example: 'users',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID of the card',
        example: 42,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Card retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'No card found with the given ID or invalid type',
        type: response_dto_1.HTTPResponseDTO,
    }),
    __param(0, (0, common_1.Headers)('accept-language')),
    __param(1, (0, common_1.Param)('type')),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], DirectusController.prototype, "getOneCard", null);
__decorate([
    (0, common_1.Get)('card/:type'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve all cards by Type' }),
    (0, swagger_1.ApiHeader)({
        name: 'accept-language',
        required: true,
        enum: ['en-US', 'fr-FR'],
        example: 'en-US',
    }),
    (0, swagger_1.ApiParam)({
        name: 'type',
        description: 'Type of the card',
        enum: ['users', 'situations'],
        example: 'users',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Cards retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'No card found or invalid type',
        type: response_dto_1.HTTPResponseDTO,
    }),
    __param(0, (0, common_1.Headers)('accept-language')),
    __param(1, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DirectusController.prototype, "getAllCard", null);
__decorate([
    (0, common_1.Get)('group/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve group by ID' }),
    (0, swagger_1.ApiHeader)({
        name: 'accept-language',
        required: true,
        enum: ['en-US', 'fr-FR'],
        example: 'en-US',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID of the group',
        example: 42,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Group retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'No group found with given ID',
        type: response_dto_1.HTTPResponseDTO,
    }),
    __param(0, (0, common_1.Headers)('accept-language')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DirectusController.prototype, "getOneGroup", null);
__decorate([
    (0, common_1.Get)('group'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve all group' }),
    (0, swagger_1.ApiHeader)({
        name: 'accept-language',
        required: true,
        enum: ['en-US', 'fr-FR'],
        example: 'en-US',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Groups retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'No group found',
        type: response_dto_1.HTTPResponseDTO,
    }),
    __param(0, (0, common_1.Headers)('accept-language')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DirectusController.prototype, "getAllGroup", null);
__decorate([
    (0, common_1.Get)('deck/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve deck by ID' }),
    (0, swagger_1.ApiHeader)({
        name: 'accept-language',
        required: true,
        enum: ['en-US', 'fr-FR'],
        example: 'en-US',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID of the deck',
        example: 42,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Deck retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'No deck found with given ID',
        type: response_dto_1.HTTPResponseDTO,
    }),
    __param(0, (0, common_1.Headers)('accept-language')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DirectusController.prototype, "getOneDeck", null);
__decorate([
    (0, common_1.Get)('deck'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve all deck' }),
    (0, swagger_1.ApiHeader)({
        name: 'accept-language',
        required: true,
        enum: ['en-US', 'fr-FR'],
        example: 'en-US',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Decks retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'No deck found',
        type: response_dto_1.HTTPResponseDTO,
    }),
    __param(0, (0, common_1.Headers)('accept-language')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DirectusController.prototype, "getAllDeck", null);
exports.DirectusController = DirectusController = __decorate([
    (0, swagger_1.ApiTags)('Directus'),
    (0, common_1.Controller)('directus'),
    __metadata("design:paramtypes", [directus_service_1.DirectusService,
        language_service_1.LanguageService])
], DirectusController);
//# sourceMappingURL=directus.controller.js.map