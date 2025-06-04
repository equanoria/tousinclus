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
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
const types_1 = require("@tousinclus/types");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const redis_service_1 = require("../redis/redis.service");
const directus_service_1 = require("../directus/directus.service");
const json2csv_1 = require("json2csv");
let GameService = class GameService {
    constructor(gameModel, redisService, directusService) {
        this.gameModel = gameModel;
        this.redisService = redisService;
        this.directusService = directusService;
    }
    async getRandomGroupId(deckIdData) {
        const deckData = await this.directusService.getDeckById(deckIdData);
        if (!Array.isArray(deckData) || deckData.length === 0) {
            return null;
        }
        const randomIndex = Math.floor(Math.random() * deckData.length);
        return deckData[randomIndex];
    }
    async generateNewGameData(createGameData, user) {
        const deckId = createGameData.deckId ?? (await this.directusService.getDeckDefault());
        const reflectionDuration = createGameData.reflectionDuration ??
            (await this.directusService.getReflectionDurationDefault());
        const groupId = await this.getRandomGroupId(deckId);
        if (groupId === null) {
            throw new common_1.NotFoundException(`Specified deck with id ${createGameData.deckId} not found`);
        }
        const newGame = {
            createdAt: new Date(),
            createdBy: user.id,
            reflectionEndsAt: null,
            _id: undefined,
            code: ((Math.random() * 1e6) | 0).toString().padStart(6, '0'),
            status: types_1.EGameStatus.WAITING,
            reflectionDuration: reflectionDuration,
            cardGroupId: groupId,
            team1: {
                isConnected: false,
                clientId: null,
            },
            team2: {
                isConnected: false,
                clientId: null,
            },
            answers: [],
            votes: [],
        };
        return newGame;
    }
    async createGame(createGameDto, user) {
        const newGame = await this.generateNewGameData(createGameDto || null, user);
        const createdGame = await this.gameModel.create(newGame);
        newGame._id = String(createdGame._id);
        await this.redisService.setGame(newGame.code, newGame);
        return newGame;
    }
    async createManyGame(i, createGameDto, user) {
        const newGames = [];
        for (let step = 0; step < i; step++) {
            const newGame = await this.generateNewGameData(createGameDto || null, user);
            newGames.push(newGame);
            await this.redisService.setGame(newGame.code, newGame);
        }
        return newGames;
    }
    async findOneGame(code) {
        const game = await this.redisService.getGame(code);
        if (!game) {
            throw new Error(`Game with code ${code} not found`);
        }
        return game;
    }
    async findAllGames() {
        const games = await this.redisService.getAllGames();
        return games;
    }
    async deleteOneGame(code) {
        const gameDelete = await this.redisService.deleteOneGame(code);
        return gameDelete;
    }
    async deleteAllGames() {
        const result = await this.redisService.deleteAllGames();
        return result;
    }
    async findVoteByCardID(votes, cardId) {
        return votes.find((entry) => entry.cardId === cardId);
    }
    async updateTeamConnectionStatus(code, team, clientId) {
        const game = await this.findOneGame(code);
        if (game.team1.clientId === clientId || game.team2.clientId === clientId) {
            throw new common_1.ForbiddenException(`Your client ID ${game.team1.clientId} is already connected`);
        }
        if (team === types_1.ETeam.TEAM1) {
            if (game.team1.isConnected) {
                throw new common_1.ForbiddenException(`Team 1 is already connected with client ID ${game.team1.clientId}`);
            }
            game.team1.isConnected = true;
            game.team1.clientId = clientId;
        }
        else if (team === types_1.ETeam.TEAM2) {
            if (game.team2.isConnected) {
                throw new common_1.ForbiddenException(`Team 2 is already connected with client ID ${game.team2.isConnected}`);
            }
            game.team2.isConnected = true;
            game.team2.clientId = clientId;
        }
        else {
            throw new common_1.BadRequestException(`Invalid team specified: ${team}`);
        }
        await this.redisService.setGame(code, game);
        return game;
    }
    async updateTeamDisconnectStatus(code, team, clientId) {
        const game = await this.findOneGame(code);
        if (!game) {
            throw new Error(`Game with code ${code} not found`);
        }
        if (team === types_1.ETeam.TEAM1) {
            if (game.team1.clientId !== clientId) {
                throw new Error(`Client ID ${clientId} is not connected to Team 1`);
            }
            game.team1.isConnected = false;
            game.team1.clientId = null;
        }
        else if (team === types_1.ETeam.TEAM2) {
            if (game.team2.clientId !== clientId) {
                throw new Error(`Client ID ${clientId} is not connected to Team 2`);
            }
            game.team2.isConnected = false;
            game.team2.clientId = null;
        }
        else {
            throw new Error(`Invalid team specified: ${team}`);
        }
        await this.redisService.setGame(code, game);
        return game;
    }
    async checkIfReadyToStart(code) {
        const game = await this.findOneGame(code);
        if (!game) {
            throw new Error(`Game with code ${code} not found`);
        }
        if (game.team1.isConnected && game.team2.isConnected) {
            await this.redisService.setGame(code, game);
            return true;
        }
        return false;
    }
    async updateReflectionEndsAt(code, reflectionEndsAt) {
        const game = await this.findOneGame(code);
        if (!game) {
            throw new common_1.NotFoundException(`Game with code ${code} not found`);
        }
        game.reflectionEndsAt = reflectionEndsAt;
        await this.redisService.setGame(code, game);
    }
    async updateGameStatus(code, status) {
        const game = await this.findOneGame(code);
        if (!game) {
            throw new common_1.NotFoundException(`Game with code ${code} not found`);
        }
        game.status = status;
        await this.redisService.setGame(code, game);
    }
    async getTeamAnswer(code, team, clientId) {
        try {
            const game = await this.findOneGame(code);
            if (game.status !== 'reflection' && game.status !== 'debate') {
                throw new Error(`Forbidden: game with code ${code} is not in the 'reflection' or 'debate' status`);
            }
            if (game.status === 'reflection') {
                if (team === types_1.ETeam.TEAM1) {
                    if (game.team1.clientId !== clientId) {
                        throw new Error(`Client ID ${clientId} is not connected to Team 1`);
                    }
                    game.answers = game.answers.filter((answer) => answer.team !== types_1.ETeam.TEAM2);
                }
                else if (team === types_1.ETeam.TEAM2) {
                    if (game.team2.clientId !== clientId) {
                        throw new Error(`Client ID ${clientId} is not connected to Team 2`);
                    }
                    game.answers = game.answers.filter((answer) => answer.team !== types_1.ETeam.TEAM1);
                }
                else {
                    throw new Error(`Invalid team specified: ${team}`);
                }
            }
            return game;
        }
        catch (error) {
            if (!error.message) {
                error.message =
                    'Failed to update team answer. Please check "game.service.ts".';
            }
            throw error;
        }
    }
    async updateTeamAnswer(code, team, clientId, data) {
        try {
            const game = await this.findOneGame(code);
            if (game.status !== 'reflection') {
                throw new Error(`Forbidden game with code ${code} is not in the 'reflection' status`);
            }
            if (team === types_1.ETeam.TEAM1) {
                if (game.team1.clientId !== clientId) {
                    throw new Error(`Client ID ${clientId} is not connected to Team 1`);
                }
                const existingAnswer = game.answers.find((entry) => entry.cardId === data.cardId && entry.team === types_1.ETeam.TEAM1);
                if (existingAnswer) {
                    existingAnswer.answer = data.answer;
                }
                else {
                    game.answers.push({
                        cardId: data.cardId,
                        team: team,
                        answer: data.answer,
                    });
                }
            }
            else if (team === types_1.ETeam.TEAM2) {
                if (game.team2.clientId !== clientId) {
                    throw new Error(`Client ID ${clientId} is not connected to Team 2`);
                }
                const existingAnswer = game.answers.find((entry) => entry.cardId === data.cardId && entry.team === types_1.ETeam.TEAM2);
                if (existingAnswer) {
                    existingAnswer.answer = data.answer;
                }
                else {
                    game.answers.push({
                        cardId: data.cardId,
                        team: team,
                        answer: data.answer,
                    });
                }
            }
            else {
                throw new Error(`Invalid team specified: ${team}`);
            }
            const existingVote = await this.findVoteByCardID(game.votes, data.cardId);
            if (!existingVote) {
                game.votes.push({
                    cardId: data.cardId,
                    votes: [],
                });
            }
            await this.redisService.setGame(code, game);
            return game;
        }
        catch (error) {
            if (!error.message) {
                error.message =
                    'Failed to update team answer. Please check "game.service.ts".';
            }
            throw error;
        }
    }
    async updateTeamVote(code, clientId, data) {
        try {
            const game = await this.findOneGame(code);
            let userTeam = data.votes[0].team;
            if (game.status !== 'debate') {
                throw new Error(`Forbidden game with code ${code} is not in the 'debate' status`);
            }
            const existingVote = await this.findVoteByCardID(game.votes, data.cardId);
            if (!existingVote) {
                throw new Error(`No existing vote found for card ID: ${data.cardId}`);
            }
            if (userTeam === types_1.ETeam.TEAM1) {
                if (game.team1.clientId !== clientId) {
                    throw new Error(`Client ID ${clientId} is not connected to Team 1`);
                }
                userTeam = types_1.ETeam.TEAM1;
            }
            else if (userTeam === types_1.ETeam.TEAM2) {
                if (game.team2.clientId !== clientId) {
                    throw new Error(`Client ID ${clientId} is not connected to Team 2`);
                }
                userTeam = types_1.ETeam.TEAM2;
            }
            const voteIndex = existingVote.votes.findIndex((v) => v.team === userTeam);
            if (voteIndex >= 0) {
                throw new Error(`Forbidden you already have voted for this game (code : ${code})`);
            }
            existingVote.votes.push(data.votes[0]);
            await this.redisService.setGame(code, game);
            return game;
        }
        catch (error) {
            if (!error.message) {
                error.message =
                    'Failed to update team answer. Please check "game.service.ts".';
            }
            throw error;
        }
    }
    async checkConsensusVote(code, cardId) {
        const REQUIRED_CARDS_COUNT = 6;
        const game = await this.findOneGame(code);
        const sortedVotes = game.votes.sort((a, b) => a.cardId - b.cardId);
        if (sortedVotes.length === REQUIRED_CARDS_COUNT) {
            const allHaveTwoVotes = sortedVotes.every((vote) => vote.votes.length === 2);
            if (allHaveTwoVotes) {
                return {
                    displayResult: true,
                };
            }
        }
        if (cardId) {
            const existingVote = sortedVotes.find((vote) => vote.cardId === cardId);
            if (existingVote && existingVote.votes.length === 2) {
                const allVotes = existingVote.votes.map((vote) => vote.vote);
                if (allVotes.every((vote) => vote === allVotes[0])) {
                    const nextCard = sortedVotes.find((vote) => vote.cardId > cardId);
                    if (nextCard) {
                        return {
                            message: 'Consensus reached for the current card. Proceed to the next card.',
                            nextCardId: nextCard.cardId,
                        };
                    }
                    return {
                        message: 'Consensus reached for the current card. No more cards remaining.',
                    };
                }
                existingVote.votes = [];
                await this.redisService.setGame(code, game);
                return {
                    message: 'Consensus not reached for the current card. Please you need to vote again.',
                    nextCardId: cardId,
                };
            }
        }
        else {
            const firstWithoutConsensus = sortedVotes.find((vote) => vote.votes.length < 2 ||
                !vote.votes.every((v) => v.vote === vote.votes[0].vote));
            if (firstWithoutConsensus) {
                return {
                    message: 'Next card to vote on identified.',
                    nextCardId: firstWithoutConsensus.cardId,
                };
            }
            return {
                message: 'All cards have reached consensus.',
            };
        }
    }
    async updateMongoGame(code) {
        const mongoGameData = await this.findOneGame(code);
        const updatedGame = await this.gameModel.findByIdAndUpdate(mongoGameData._id, mongoGameData, { new: true });
        return updatedGame;
    }
    async exportGameByDate(targetDate) {
        const nextDay = new Date(targetDate);
        nextDay.setDate(targetDate.getDate() + 1);
        const games = await this.gameModel
            .find({
            createdAt: {
                $gte: targetDate,
                $lt: nextDay,
            },
        })
            .lean();
        if (games.length === 0) {
            return '';
        }
        const createdByUniqueIds = Array.from(new Set(games.map((g) => g.createdBy)));
        const users = await this.directusService.getFirstLastNameById(createdByUniqueIds);
        const userMap = new Map(users.map((user) => [user.id, `${user.first_name} ${user.last_name}`]));
        const flatGames = games.map((game) => {
            let score_team1 = 0;
            let score_team2 = 0;
            for (const voteGroup of game.votes || []) {
                let team1Votes = 0;
                let team2Votes = 0;
                for (const vote of voteGroup.votes || []) {
                    if (vote.vote === 'team1')
                        team1Votes++;
                    else if (vote.vote === 'team2')
                        team2Votes++;
                }
                if (team1Votes > team2Votes)
                    score_team1++;
                else if (team2Votes > team1Votes)
                    score_team2++;
            }
            return {
                id: game._id,
                code: game.code,
                cardGroupId: game.cardGroupId,
                createdAt: game.createdAt,
                updatedAt: game.updatedAt,
                createdBy_id: game.createdBy ?? '',
                createdBy_name: userMap.get(game.createdBy) ?? 'Inconnu',
                score_team1,
                score_team2,
            };
        });
        const fields = [
            'id',
            'code',
            'cardGroupId',
            'createdAt',
            'updatedAt',
            'createdBy_id',
            'createdBy_name',
            'score_team1',
            'score_team2',
        ];
        const parser = new json2csv_1.Parser({ fields });
        const csv = parser.parse(flatGames);
        return csv;
    }
};
exports.GameService = GameService;
exports.GameService = GameService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Game')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        redis_service_1.RedisService,
        directus_service_1.DirectusService])
], GameService);
//# sourceMappingURL=game.service.js.map