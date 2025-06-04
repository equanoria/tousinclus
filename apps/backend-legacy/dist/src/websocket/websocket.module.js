"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketModule = void 0;
const common_1 = require("@nestjs/common");
const game_module_1 = require("../game/game.module");
const websocket_gateway_1 = require("./websocket.gateway");
const schedule_1 = require("@nestjs/schedule");
const core_1 = require("@nestjs/core");
const websocket_exception_filter_1 = require("../utils/filters/websocket-exception.filter");
const debate_service_1 = require("./service/debate.service");
const disconnect_service_1 = require("./service/disconnect.service");
const reflection_service_1 = require("./service/reflection.service");
const waiting_service_1 = require("./service/waiting.service");
const joining_service_1 = require("./service/joining.service");
const result_service_1 = require("./service/result.service");
const redis_service_1 = require("../redis/redis.service");
const config_1 = require("@nestjs/config");
let WebsocketModule = class WebsocketModule {
};
exports.WebsocketModule = WebsocketModule;
exports.WebsocketModule = WebsocketModule = __decorate([
    (0, common_1.Module)({
        imports: [game_module_1.GameModule, schedule_1.ScheduleModule.forRoot()],
        providers: [
            websocket_gateway_1.WebsocketGateway,
            waiting_service_1.WaitingService,
            reflection_service_1.ReflectionService,
            debate_service_1.DebateService,
            result_service_1.ResultService,
            disconnect_service_1.DisconnectService,
            joining_service_1.JoiningService,
            redis_service_1.RedisService,
            config_1.ConfigService,
            {
                provide: core_1.APP_FILTER,
                useClass: websocket_exception_filter_1.WebsocketExceptionFilter,
            },
        ],
    })
], WebsocketModule);
//# sourceMappingURL=websocket.module.js.map