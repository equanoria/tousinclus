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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const game_dto_1 = require("./dto/game.dto");
const game_service_1 = require("./game.service");
const response_dto_1 = require("../utils/dto/response.dto");
const auth_guard_1 = require("./auth/auth.guard");
const roles_decorator_1 = require("./auth/roles.decorator");
const types_1 = require("@tousinclus/types");
const roles_guard_1 = require("./auth/roles.guard");
const parse_date_pipe_1 = require("../utils/pipes/parse-date.pipe");
const user_decorator_1 = require("../utils/decorators/user.decorator");
let GameController = class GameController {
    constructor(gameService) {
        this.gameService = gameService;
    }
    createGame(createGameDto, user) {
        const game = this.gameService.createGame({ ...createGameDto }, user);
        if (!game) {
            throw new common_1.HttpException('Failed to create a game', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return game;
    }
    createManyGame(createGameDto, user, numberOfGame) {
        const games = this.gameService.createManyGame(numberOfGame, {
            ...createGameDto,
        }, user);
        if (!games) {
            throw new common_1.HttpException(`Failed to create ${numberOfGame} games`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return games;
    }
    async getOneGame(code) {
        const game = await this.gameService.findOneGame(code);
        if (!game) {
            throw new common_1.NotFoundException(`Game with code ${code} not found`);
        }
        return game;
    }
    async getAllGames() {
        const allGames = await this.gameService.findAllGames();
        if (!allGames || allGames.length === 0) {
            throw new common_1.NotFoundException('Database is empty');
        }
        return allGames;
    }
    async deleteOneGame(code) {
        const game = await this.gameService.deleteOneGame(code);
        if (!game) {
            throw new common_1.NotFoundException(`Game with code ${code} not found`);
        }
        return {
            statusCode: common_1.HttpStatus.OK,
            message: `The game ${code} has been successfully deleted`,
        };
    }
    async deleteAllGames() {
        const deleteAllGames = await this.gameService.deleteAllGames();
        if (deleteAllGames.length === 0) {
            throw new common_1.NotFoundException('Database is empty');
        }
        return deleteAllGames;
    }
    async exportGames(date, res) {
        const gamesCSV = await this.gameService.exportGameByDate(date);
        if (!gamesCSV) {
            throw new common_1.NotFoundException(`No game found for the provided date : ${date}.`);
        }
        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', 'attachment; filename="games.csv"');
        res.send(gamesCSV);
    }
};
exports.GameController = GameController;
__decorate([
    (0, common_1.Put)(),
    (0, common_1.HttpCode)(201),
    (0, swagger_1.ApiOperation)({ summary: 'Create one game' }),
    (0, swagger_1.ApiBody)({
        description: 'Game creation data. The body is optional (example: { deckId: 1 }).',
        type: game_dto_1.CreateGameDTO,
        required: false,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Specified Deck with id xxx not found',
        type: response_dto_1.HTTPResponseDTO,
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The game has been successfully created',
        type: game_dto_1.GameDTO,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [game_dto_1.CreateGameDTO, Object]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "createGame", null);
__decorate([
    (0, common_1.Put)(':numberOfGame'),
    (0, common_1.HttpCode)(201),
    (0, swagger_1.ApiOperation)({ summary: 'Create multiple games' }),
    (0, swagger_1.ApiParam)({
        name: 'numberOfGame',
        description: 'The number of games to create',
        example: 5,
    }),
    (0, swagger_1.ApiBody)({
        description: 'Game creation data. The body is optional (example: { deckId: 1 }).',
        type: game_dto_1.CreateGameDTO,
        required: false,
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The games have been successfully created',
        type: [game_dto_1.GameDTO],
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Specified Deck with the given id not found',
        type: response_dto_1.HTTPResponseDTO,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __param(2, (0, common_1.Param)('numberOfGame', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [game_dto_1.CreateGameDTO, Object, Number]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "createManyGame", null);
__decorate([
    (0, common_1.Get)(':code'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a game by its code' }),
    (0, swagger_1.ApiParam)({
        name: 'code',
        description: 'The unique code of the game',
        example: '119949',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The game was found and returned successfully',
        type: game_dto_1.GameDTO,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Game not found',
        type: response_dto_1.HTTPResponseDTO,
    }),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "getOneGame", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve all games' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully retrieved all games',
        type: [game_dto_1.GameDTO],
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'No games found in the database',
        type: response_dto_1.HTTPResponseDTO,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GameController.prototype, "getAllGames", null);
__decorate([
    (0, common_1.Delete)(':code'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a game by its code' }),
    (0, swagger_1.ApiParam)({
        name: 'code',
        description: 'Unique game code to delete',
        example: '119949',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The game has been successfully deleted',
        type: response_dto_1.HTTPResponseDTO,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Game not found',
        type: response_dto_1.HTTPResponseDTO,
    }),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "deleteOneGame", null);
__decorate([
    (0, common_1.Delete)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete all games' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully delete all games',
        type: [game_dto_1.GameDTO],
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'No games found in the database',
        type: response_dto_1.HTTPResponseDTO,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GameController.prototype, "deleteAllGames", null);
__decorate([
    (0, common_1.Get)('/export/:date.csv'),
    (0, swagger_1.ApiOperation)({ summary: 'Export games for a specific date' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully export games',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'No games found for this date',
        type: response_dto_1.HTTPResponseDTO,
    }),
    __param(0, (0, common_1.Param)('date', parse_date_pipe_1.ParseDatePipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date, Object]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "exportGames", null);
exports.GameController = GameController = __decorate([
    (0, swagger_1.ApiTags)('Game'),
    (0, roles_decorator_1.Roles)(types_1.ERole.HOST),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('game'),
    __metadata("design:paramtypes", [game_service_1.GameService])
], GameController);
//# sourceMappingURL=game.controller.js.map