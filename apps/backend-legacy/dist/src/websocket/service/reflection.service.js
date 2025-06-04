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
exports.ReflectionService = void 0;
const common_1 = require("@nestjs/common");
const game_service_1 = require("../../game/game.service");
const websockets_1 = require("@nestjs/websockets");
const response_dto_1 = require("../../utils/dto/response.dto");
const game_dto_1 = require("../../game/dto/game.dto");
const class_transformer_1 = require("class-transformer");
let ReflectionService = class ReflectionService {
    constructor(gameService) {
        this.gameService = gameService;
    }
    async handleReflectionLogic(client, data) {
        const { action, ...CData } = data;
        switch (action) {
            case 'get-answers':
                await this.getAnswers(client, CData);
                break;
            case 'update-answer':
                await this.updateAnswer(client, CData);
                break;
            default: {
                const responseData = {
                    status: 'error',
                    errorCode: response_dto_1.ErrorCode.VALIDATION_FAILED,
                    message: `Unrecognized action "${action}"`,
                    responseChannel: 'reflection-response',
                };
                throw new websockets_1.WsException(responseData);
            }
        }
    }
    async getAnswers(client, data) {
        try {
            console.log(data);
            const game = await this.gameService.getTeamAnswer(data.code, data.team, client.id);
            const dataGame = (0, class_transformer_1.plainToInstance)(game_dto_1.GameDTO, game, {
                excludeExtraneousValues: true,
                groups: ['room', 'reflection', client.data.team],
            });
            client.emit('reflection-response', {
                status: 'success',
                message: `You successfully retrieve answers for ${data.team} in game ${data.code}`,
                data: dataGame,
            });
        }
        catch (error) {
            const errorCode = response_dto_1.ErrorCode.GENERIC_ERROR;
            const responseData = {
                status: 'error',
                errorCode: errorCode,
                message: error.message,
                responseChannel: 'reflection-response',
            };
            throw new websockets_1.WsException(responseData);
        }
    }
    async updateAnswer(client, data) {
        try {
            if ('answer' in data.data) {
                await this.gameService.updateTeamAnswer(data.code, data.data.team, client.id, data.data);
                client.emit('reflection-response', {
                    status: 'success',
                    message: `You successfully saved answer for card id: ${data.data.cardId}`,
                    data: data.data,
                });
            }
            else {
                throw new common_1.BadRequestException('Please provide field "data" to update answers');
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
                responseChannel: 'reflection-response',
            };
            throw new websockets_1.WsException(responseData);
        }
    }
};
exports.ReflectionService = ReflectionService;
exports.ReflectionService = ReflectionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [game_service_1.GameService])
], ReflectionService);
//# sourceMappingURL=reflection.service.js.map