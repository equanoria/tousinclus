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
exports.LanguageService = void 0;
const common_1 = require("@nestjs/common");
const directus_service_1 = require("../../directus/directus.service");
const cache_manager_1 = require("@nestjs/cache-manager");
let LanguageService = class LanguageService {
    constructor(directusService, cacheManager) {
        this.directusService = directusService;
        this.cacheManager = cacheManager;
        this.LANGUAGE_CODE_TTL = 86400;
    }
    async getPreferredLanguage(acceptLanguage) {
        if (!acceptLanguage) {
            throw new common_1.BadRequestException('Accept-Language header is missing');
        }
        let cachedLanguages = await this.cacheManager.get('languages');
        if (!cachedLanguages?.length) {
            cachedLanguages =
                (await this.directusService.languageRequest());
            await this.cacheManager.set('languages', cachedLanguages, this.LANGUAGE_CODE_TTL);
        }
        if (!cachedLanguages.includes(acceptLanguage)) {
            throw new common_1.BadRequestException(`Unsupported language: ${acceptLanguage}`);
        }
        return acceptLanguage;
    }
};
exports.LanguageService = LanguageService;
exports.LanguageService = LanguageService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [directus_service_1.DirectusService, Object])
], LanguageService);
//# sourceMappingURL=language.service.js.map