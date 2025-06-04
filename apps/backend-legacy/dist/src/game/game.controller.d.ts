import { CreateGameDTO, GameDTO } from './dto/game.dto';
import { GameService } from './game.service';
import { HTTPResponseDTO } from 'src/utils/dto/response.dto';
import { IUser } from '@tousinclus/types';
import { Response } from 'express';
export declare class GameController {
    private readonly gameService;
    constructor(gameService: GameService);
    createGame(createGameDto: CreateGameDTO, user: IUser): Promise<GameDTO>;
    createManyGame(createGameDto: CreateGameDTO, user: IUser, numberOfGame: number): Promise<GameDTO[]>;
    getOneGame(code: GameDTO['code']): Promise<GameDTO>;
    getAllGames(): Promise<GameDTO[]>;
    deleteOneGame(code: string): Promise<HTTPResponseDTO>;
    deleteAllGames(): Promise<GameDTO[]>;
    exportGames(date: Date, res: Response): Promise<void>;
}
