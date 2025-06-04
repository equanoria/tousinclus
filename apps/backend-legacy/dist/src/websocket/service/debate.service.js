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
exports.DebateService = void 0;
const common_1 = require("@nestjs/common");
const types_1 = require("@tousinclus/types");
const game_service_1 = require("../../game/game.service");
const websockets_1 = require("@nestjs/websockets");
const response_dto_1 = require("../../utils/dto/response.dto");
let DebateService = class DebateService {
    constructor(gameService) {
        this.gameService = gameService;
    }
    async handleDebateLogic(server, client, data) {
        const { action, ...CData } = data;
        switch (action) {
            case 'get-vote':
                await this.getVote(client, CData);
                break;
            case 'update-vote':
                await this.updateVote(server, client, CData);
                break;
            default: {
                const responseData = {
                    status: 'error',
                    errorCode: response_dto_1.ErrorCode.VALIDATION_FAILED,
                    message: `Unrecognized action "${action}"`,
                    responseChannel: 'debate-response',
                };
                throw new websockets_1.WsException(responseData);
            }
        }
    }
    async getVote(client, data) {
        try {
            const nextCardToVote = await this.gameService.checkConsensusVote(data.code, null);
            const game = await this.gameService.getTeamAnswer(data.code, data.team, client.id);
            const dataGameAnswers = game.answers.filter((answer) => answer.cardId === nextCardToVote.nextCardId);
            if (nextCardToVote) {
                const responseData = {
                    status: 'success',
                    message: nextCardToVote.message,
                    data: {
                        nextCardId: nextCardToVote.nextCardId
                            ? { nextCardId: nextCardToVote.nextCardId }
                            : null,
                        answers: dataGameAnswers,
                    },
                };
                client.emit('debate-response', responseData);
            }
        }
        catch (error) {
            let errorCode = response_dto_1.ErrorCode.GENERIC_ERROR;
            if (error instanceof common_1.BadRequestException) {
                errorCode = response_dto_1.ErrorCode.BAD_REQUEST;
            }
            const responseData = {
                status: 'error',
                errorCode: errorCode,
                message: error.message,
                responseChannel: 'debate-response',
            };
            throw new websockets_1.WsException(responseData);
        }
    }
    async updateVote(server, client, data) {
        try {
            if ('votes' in data.data) {
                await this.gameService.updateTeamVote(data.code, client.id, data.data);
                client.emit('debate-response', {
                    status: 'success',
                    message: `You successfully update vote from card ${data.data.cardId}`,
                    data: data,
                });
                const nextCardToVote = await this.gameService.checkConsensusVote(data.code, data.data.cardId);
                if (nextCardToVote?.displayResult) {
                    await this.gameService.updateGameStatus(data.code, types_1.EGameStatus.RESULT);
                    await this.gameService.updateMongoGame(data.code);
                    const responseData = { gameStatus: types_1.EGameStatus.RESULT };
                    server.to(data.code).emit('game-status', responseData);
                }
                if (nextCardToVote?.message) {
                    const responseData = {
                        status: 'success',
                        message: nextCardToVote.message,
                        data: nextCardToVote.nextCardId
                            ? { nextCardId: nextCardToVote.nextCardId }
                            : null,
                    };
                    server.to(data.code).emit('debate-response', responseData);
                }
            }
            else {
                throw new common_1.BadRequestException('Please provide field "voteData" to update vote');
            }
        }
        catch (error) {
            let errorCode = response_dto_1.ErrorCode.GENERIC_ERROR;
            if (error instanceof common_1.BadRequestException) {
                errorCode = response_dto_1.ErrorCode.BAD_REQUEST;
            }
            const responseData = {
                status: 'error',
                errorCode: errorCode,
                message: error.message,
                responseChannel: 'debate-response',
            };
            throw new websockets_1.WsException(responseData);
        }
    }
};
exports.DebateService = DebateService;
exports.DebateService = DebateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [game_service_1.GameService])
], DebateService);
//# sourceMappingURL=debate.service.js.map