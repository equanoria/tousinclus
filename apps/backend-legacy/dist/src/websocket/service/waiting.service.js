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
exports.WaitingService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const node_timers_1 = require("node:timers");
const game_service_1 = require("../../game/game.service");
const websockets_1 = require("@nestjs/websockets");
const response_dto_1 = require("../../utils/dto/response.dto");
const game_dto_1 = require("../../game/dto/game.dto");
const class_transformer_1 = require("class-transformer");
const types_1 = require("@tousinclus/types");
let WaitingService = class WaitingService {
    constructor(gameService, schedulerRegistry) {
        this.gameService = gameService;
        this.schedulerRegistry = schedulerRegistry;
    }
    async handleWaitingLogic(server, client, data) {
        const { action, ...CData } = data;
        switch (action) {
            case 'handle-team':
                await this.handleTeamConnection(server, client, CData.code, CData.team, client.id);
                break;
            default: {
                const responseData = {
                    status: 'error',
                    errorCode: response_dto_1.ErrorCode.VALIDATION_FAILED,
                    message: `Unrecognized action "${action}"`,
                    responseChannel: 'joining-response',
                };
                throw new websockets_1.WsException(responseData);
            }
        }
    }
    async handleTeamConnection(server, client, code, team, clientId) {
        try {
            if (!team) {
                throw new common_1.BadRequestException(`No team specified. Please provide either 'team1' or 'team2'.`);
            }
            const formattedTeam = team.toLowerCase().replace(/\s/g, '');
            const updatedGame = await this.gameService.updateTeamConnectionStatus(code, formattedTeam, clientId);
            client.data.team = formattedTeam;
            client.data.code = code;
            client.join(code);
            const dataGame = (0, class_transformer_1.plainToInstance)(game_dto_1.GameDTO, updatedGame, {
                excludeExtraneousValues: true,
                groups: ['room', client.data.team],
            });
            client.emit('waiting-response', {
                status: 'success',
                message: `You successfully join ${formattedTeam}`,
                data: dataGame,
            });
            if (dataGame.status === types_1.EGameStatus.WAITING) {
                const isReadyToStart = await this.gameService.checkIfReadyToStart(code);
                if (isReadyToStart) {
                    const responseData = {
                        gameStatus: types_1.EGameStatus.REFLECTION,
                        timeStamp: new Date(),
                    };
                    await this.gameService.updateGameStatus(code, types_1.EGameStatus.REFLECTION);
                    const reflectionDuration = dataGame.reflectionDuration * 60 * 1000;
                    const reflectionEndTime = new Date(Date.now() + reflectionDuration);
                    await this.gameService.updateReflectionEndsAt(code, reflectionEndTime);
                    const timeout = (0, node_timers_1.setTimeout)(() => {
                        this.executeDebateLogic(server, code);
                    }, reflectionDuration);
                    this.schedulerRegistry.addTimeout(`reflection-${dataGame.code}`, timeout);
                    console.log(`Dans ${dataGame.reflectionDuration} min je vais passer en phase débat`);
                    server.to(code).emit('game-status', responseData);
                }
            }
        }
        catch (error) {
            let errorCode = response_dto_1.ErrorCode.GENERIC_ERROR;
            if (error instanceof common_1.NotFoundException) {
                errorCode = response_dto_1.ErrorCode.NOT_FOUND;
            }
            else if (error instanceof common_1.ForbiddenException) {
                errorCode = response_dto_1.ErrorCode.FORBIDDEN;
            }
            else if (error instanceof common_1.BadRequestException) {
                errorCode = response_dto_1.ErrorCode.BAD_REQUEST;
            }
            const responseData = {
                status: 'error',
                errorCode: errorCode,
                message: error.message,
                responseChannel: 'waiting-response',
            };
            throw new websockets_1.WsException(responseData);
        }
    }
    executeDebateLogic(server, code) {
        const responseData = { gameStatus: types_1.EGameStatus.DEBATE };
        this.gameService.updateGameStatus(code, types_1.EGameStatus.DEBATE);
        console.log('Je suis en phase débat');
        server.to(code).emit('game-status', responseData);
    }
};
exports.WaitingService = WaitingService;
exports.WaitingService = WaitingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [game_service_1.GameService,
        schedule_1.SchedulerRegistry])
], WaitingService);
//# sourceMappingURL=waiting.service.js.map