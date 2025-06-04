"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const game_module_1 = require("./game/game.module");
const redis_module_1 = require("./redis/redis.module");
const websocket_module_1 = require("./websocket/websocket.module");
const directus_module_1 = require("./directus/directus.module");
const mongoose_1 = require("@nestjs/mongoose");
const configuration_1 = require("../config/configuration");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: ['./.env.local', './.env.development'],
                load: [configuration_1.default],
            }),
            websocket_module_1.WebsocketModule,
            redis_module_1.RedisModule,
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    uri: `mongodb://${configService.getOrThrow('MONGO_USERNAME')}:${configService.getOrThrow('MONGO_PASSWORD')}@${configService.getOrThrow('MONGO_HOSTNAME')}:${configService.getOrThrow('MONGO_PORT')}/${configService.getOrThrow('MONGO_DATABASE')}?authSource=admin`,
                }),
            }),
            game_module_1.GameModule,
            directus_module_1.DirectusModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map