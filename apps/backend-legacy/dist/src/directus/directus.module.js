"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectusModule = void 0;
const common_1 = require("@nestjs/common");
const directus_controller_1 = require("./directus.controller");
const language_service_1 = require("../utils/services/language.service");
const directus_service_1 = require("./directus.service");
const formatter_service_1 = require("../utils/services/formatter.service");
const cache_manager_1 = require("@nestjs/cache-manager");
const config_1 = require("@nestjs/config");
let DirectusModule = class DirectusModule {
};
exports.DirectusModule = DirectusModule;
exports.DirectusModule = DirectusModule = __decorate([
    (0, common_1.Module)({
        imports: [cache_manager_1.CacheModule.register(), config_1.ConfigModule],
        controllers: [directus_controller_1.DirectusController],
        providers: [directus_service_1.DirectusService, formatter_service_1.FormatterService, language_service_1.LanguageService],
        exports: [directus_service_1.DirectusService],
    })
], DirectusModule);
//# sourceMappingURL=directus.module.js.map