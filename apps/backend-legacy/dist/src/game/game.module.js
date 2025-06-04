"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameModule = void 0;
const common_1 = require("@nestjs/common");
const redis_module_1 = require("../redis/redis.module");
const game_controller_1 = require("./game.controller");
const game_service_1 = require("./game.service");
const directus_module_1 = require("../directus/directus.module");
const cache_manager_1 = require("@nestjs/cache-manager");
const auth_guard_1 = require("./auth/auth.guard");
const auth_service_1 = require("./auth/auth.service");
const jwt_1 = require("@nestjs/jwt");
const roles_guard_1 = require("./auth/roles.guard");
const mongoose_1 = require("@nestjs/mongoose");
const game_schema_1 = require("./schema/game.schema");
let GameModule = class GameModule {
};
exports.GameModule = GameModule;
exports.GameModule = GameModule = __decorate([
    (0, common_1.Module)({
        imports: [
            redis_module_1.RedisModule,
            mongoose_1.MongooseModule.forFeature([{ name: 'Game', schema: game_schema_1.GameSchema }]),
            directus_module_1.DirectusModule,
            cache_manager_1.CacheModule.register(),
            jwt_1.JwtModule.register({}),
        ],
        controllers: [game_controller_1.GameController],
        providers: [game_service_1.GameService, auth_service_1.AuthService, auth_guard_1.AuthGuard, roles_guard_1.RolesGuard],
        exports: [game_service_1.GameService],
    })
], GameModule);
//# sourceMappingURL=game.module.js.map