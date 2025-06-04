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
var WebsocketGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const redis_ttl_interceptor_1 = require("../utils/interceptors/redis-ttl.interceptor");
const socket_io_1 = require("socket.io");
const joining_service_1 = require("./service/joining.service");
const waiting_service_1 = require("./service/waiting.service");
const reflection_service_1 = require("./service/reflection.service");
const debate_service_1 = require("./service/debate.service");
const result_service_1 = require("./service/result.service");
const disconnect_service_1 = require("./service/disconnect.service");
const websocket_dto_1 = require("./dto/websocket.dto");
const websocket_validation_pipe_1 = require("../utils/pipes/websocket-validation.pipe");
const websocket_exception_filter_1 = require("../utils/filters/websocket-exception.filter");
let WebsocketGateway = WebsocketGateway_1 = class WebsocketGateway {
    constructor(joiningService, waitingService, reflectionService, debatService, resultService, disconnectService) {
        this.joiningService = joiningService;
        this.waitingService = waitingService;
        this.reflectionService = reflectionService;
        this.debatService = debatService;
        this.resultService = resultService;
        this.disconnectService = disconnectService;
        this.logger = new common_1.Logger(WebsocketGateway_1.name);
    }
    async handleConnection(client) {
        this.logger.log(`Client connected ${client.id}`);
    }
    async handleDisconnect(client) {
        this.logger.log(`Client disconnected ${client.id}`);
        await this.disconnectService.handleDisconnectLogic(client);
    }
    async handleJoining(data, client) {
        await this.joiningService.handleJoiningLogic(client, { ...data });
    }
    async handleWaiting(data, client) {
        await this.waitingService.handleWaitingLogic(this.server, client, {
            ...data,
        });
    }
    async handleReflection(data, client) {
        await this.reflectionService.handleReflectionLogic(client, {
            ...data,
        });
    }
    async handleDebate(data, client) {
        await this.debatService.handleDebateLogic(this.server, client, { ...data });
    }
    async handleResult(data, client) {
        await this.resultService.handleResultLogic(client, { ...data });
    }
};
exports.WebsocketGateway = WebsocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], WebsocketGateway.prototype, "server", void 0);
__decorate([
    (0, common_1.UseInterceptors)(redis_ttl_interceptor_1.RedisTtlInterceptor),
    (0, websockets_1.SubscribeMessage)('joining'),
    __param(0, (0, websockets_1.MessageBody)(new websocket_validation_pipe_1.WebsocketValidationPipe('joining-response'))),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [websocket_dto_1.WSControllerDTO,
        socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], WebsocketGateway.prototype, "handleJoining", null);
__decorate([
    (0, common_1.UseInterceptors)(redis_ttl_interceptor_1.RedisTtlInterceptor),
    (0, websockets_1.SubscribeMessage)('waiting'),
    __param(0, (0, websockets_1.MessageBody)(new websocket_validation_pipe_1.WebsocketValidationPipe('waiting-response'))),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [websocket_dto_1.WSControllerDTO,
        socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], WebsocketGateway.prototype, "handleWaiting", null);
__decorate([
    (0, common_1.UseInterceptors)(redis_ttl_interceptor_1.RedisTtlInterceptor),
    (0, websockets_1.SubscribeMessage)('reflection'),
    __param(0, (0, websockets_1.MessageBody)(new websocket_validation_pipe_1.WebsocketValidationPipe('reflection-response'))),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [websocket_dto_1.WSControllerDTO,
        socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], WebsocketGateway.prototype, "handleReflection", null);
__decorate([
    (0, common_1.UseInterceptors)(redis_ttl_interceptor_1.RedisTtlInterceptor),
    (0, websockets_1.SubscribeMessage)('debate'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [websocket_dto_1.WSControllerDTO,
        socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], WebsocketGateway.prototype, "handleDebate", null);
__decorate([
    (0, common_1.UseInterceptors)(redis_ttl_interceptor_1.RedisTtlInterceptor),
    (0, websockets_1.SubscribeMessage)('result'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [websocket_dto_1.WSControllerDTO,
        socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], WebsocketGateway.prototype, "handleResult", null);
exports.WebsocketGateway = WebsocketGateway = WebsocketGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
        serveClient: false,
    }),
    (0, common_1.UseFilters)(new websocket_exception_filter_1.WebsocketExceptionFilter()),
    __metadata("design:paramtypes", [joining_service_1.JoiningService,
        waiting_service_1.WaitingService,
        reflection_service_1.ReflectionService,
        debate_service_1.DebateService,
        result_service_1.ResultService,
        disconnect_service_1.DisconnectService])
], WebsocketGateway);
//# sourceMappingURL=websocket.gateway.js.map