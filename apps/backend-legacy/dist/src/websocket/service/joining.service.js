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
exports.JoiningService = void 0;
const common_1 = require("@nestjs/common");
const game_service_1 = require("../../game/game.service");
const websockets_1 = require("@nestjs/websockets");
const response_dto_1 = require("../../utils/dto/response.dto");
const class_transformer_1 = require("class-transformer");
const game_dto_1 = require("../../game/dto/game.dto");
let JoiningService = class JoiningService {
    constructor(gameService) {
        this.gameService = gameService;
    }
    async handleJoiningLogic(client, data) {
        const { action, ...CData } = data;
        switch (action) {
            case 'joining-game':
                await this.handleJoiningGame(client, CData);
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
    async handleJoiningGame(client, data) {
        try {
            const findOneGameData = await this.gameService.findOneGame(data.code);
            if (!findOneGameData) {
                const responseData = {
                    status: 'error',
                    errorCode: response_dto_1.ErrorCode.NOT_FOUND,
                    message: `There is no game found with code "${data.code}"`,
                    responseChannel: 'joining-response',
                };
                throw new websockets_1.WsException(responseData);
            }
            const modifiedGameData = (0, class_transformer_1.plainToInstance)(game_dto_1.GameDTO, findOneGameData, {
                excludeExtraneousValues: true,
                groups: ['joining'],
            });
            client.emit('joining-response', {
                status: 'success',
                message: `${modifiedGameData.code} room is available`,
                data: modifiedGameData,
            });
        }
        catch (error) {
            const errorCode = response_dto_1.ErrorCode.GENERIC_ERROR;
            const responseData = {
                status: 'error',
                errorCode: errorCode,
                message: error.message,
                responseChannel: 'joining-response',
            };
            throw new websockets_1.WsException(responseData);
        }
    }
};
exports.JoiningService = JoiningService;
exports.JoiningService = JoiningService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [game_service_1.GameService])
], JoiningService);
//# sourceMappingURL=joining.service.js.map