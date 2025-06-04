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
exports.ResultService = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const game_service_1 = require("../../game/game.service");
const response_dto_1 = require("../../utils/dto/response.dto");
let ResultService = class ResultService {
    constructor(gameService) {
        this.gameService = gameService;
    }
    async handleResultLogic(client, data) {
        const { action, ...CData } = data;
        switch (action) {
            case 'get-result':
                await this.getResultGame(client, CData);
                break;
            default: {
                const responseData = {
                    status: 'error',
                    errorCode: response_dto_1.ErrorCode.VALIDATION_FAILED,
                    message: `Unrecognized action "${action}"`,
                    responseChannel: 'result-response',
                };
                throw new websockets_1.WsException(responseData);
            }
        }
    }
    calculateScores(game) {
        const score = {
            team1: 0,
            team2: 0,
        };
        for (const voteGroup of game.votes) {
            const voteCount = {
                team1: 0,
                team2: 0,
            };
            for (const vote of voteGroup.votes) {
                if (vote.vote in voteCount) {
                    voteCount[vote.vote]++;
                }
            }
            if (voteCount.team1 > voteCount.team2) {
                score.team1 += 1;
            }
            else if (voteCount.team2 > voteCount.team1) {
                score.team2 += 1;
            }
        }
        return score;
    }
    async getResultGame(client, data) {
        const findOneGameData = await this.gameService.findOneGame(data.code);
        if (!findOneGameData) {
            const responseData = {
                status: 'error',
                errorCode: response_dto_1.ErrorCode.NOT_FOUND,
                message: `There is no game found with code "${data.code}"`,
                responseChannel: 'result-response',
            };
            throw new websockets_1.WsException(responseData);
        }
        if (findOneGameData.status !== 'result') {
            throw new Error(`Forbidden game with code ${data.code} is not in the 'result' status`);
        }
        const score = this.calculateScores(findOneGameData);
        const responseData = {
            status: 'success',
            message: `You successfully retrieve result for game ${data.code}`,
            data: score,
        };
        client.emit('result-response', responseData);
    }
};
exports.ResultService = ResultService;
exports.ResultService = ResultService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [game_service_1.GameService])
], ResultService);
//# sourceMappingURL=result.service.js.map