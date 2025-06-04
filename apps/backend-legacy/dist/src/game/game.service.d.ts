import { AnswerDTO, CreateGameDTO, GameDTO, VoteDTO } from './dto/game.dto';
import { IUser } from '@tousinclus/types';
import { Model } from 'mongoose';
import { GameDocument } from './schema/game.schema';
import { RedisService } from '../redis/redis.service';
import { DirectusService } from 'src/directus/directus.service';
export declare class GameService {
    private readonly gameModel;
    private readonly redisService;
    private readonly directusService;
    constructor(gameModel: Model<GameDocument>, redisService: RedisService, directusService: DirectusService);
    private getRandomGroupId;
    private generateNewGameData;
    createGame(createGameDto: CreateGameDTO, user: IUser): Promise<GameDTO>;
    createManyGame(i: number, createGameDto: CreateGameDTO, user: IUser): Promise<GameDTO[]>;
    findOneGame(code: GameDTO['code']): Promise<GameDTO>;
    findAllGames(): Promise<GameDTO[]>;
    deleteOneGame(code: GameDTO['code']): Promise<boolean>;
    deleteAllGames(): Promise<GameDTO[]>;
    findVoteByCardID(votes: VoteDTO[], cardId: number): Promise<VoteDTO>;
    updateTeamConnectionStatus(code: GameDTO['code'], team: string, clientId: string): Promise<GameDTO>;
    updateTeamDisconnectStatus(code: GameDTO['code'], team: string, clientId: string): Promise<GameDTO>;
    checkIfReadyToStart(code: GameDTO['code']): Promise<boolean>;
    updateReflectionEndsAt(code: GameDTO['code'], reflectionEndsAt: GameDTO['reflectionEndsAt']): Promise<void>;
    updateGameStatus(code: GameDTO['code'], status: GameDTO['status']): Promise<void>;
    getTeamAnswer(code: GameDTO['code'], team: string, clientId: string): Promise<GameDTO>;
    updateTeamAnswer(code: GameDTO['code'], team: string, clientId: string, data: AnswerDTO): Promise<GameDTO>;
    updateTeamVote(code: GameDTO['code'], clientId: string, data: VoteDTO): Promise<GameDTO>;
    checkConsensusVote(code: GameDTO['code'], cardId: VoteDTO['cardId']): Promise<{
        displayResult: boolean;
        message?: undefined;
        nextCardId?: undefined;
    } | {
        message: string;
        nextCardId: number;
        displayResult?: undefined;
    } | {
        message: string;
        displayResult?: undefined;
        nextCardId?: undefined;
    }>;
    updateMongoGame(code: GameDTO['code']): Promise<import("mongoose").Document<unknown, {}, GameDocument> & GameDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    exportGameByDate(targetDate: Date): Promise<any>;
}
