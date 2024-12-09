import { Injectable } from '@nestjs/common';
import { Game } from './interfaces/game.interface';
import { RedisService } from '../redis/redis.service'

@Injectable()
export class GameService {

    constructor(
        private readonly redisService: RedisService,
    ) { }

    private generateNewGameData(): Game {
        const newGame: Game = {
            code: Math.random().toString(36).substring(2, 8).toUpperCase(),
            isTeam1Connected: false,
            isTeam2Connected: false,
        };
        return newGame;
    }

    async createGame(): Promise<Game> {
        const newGame = this.generateNewGameData()
        await this.redisService.setGame(newGame.code, newGame);     // add new game data to redis db
        return newGame;     // Return the game create as JSON
    }

    async createManyGame(i: number): Promise<Game[]> {
        let newGames: Game[] = [];
        for (let step = 0; step < i; step++) {  
            const newGame = this.generateNewGameData()    // Generate i game data
            await newGames.push(newGame);
            await this.redisService.setGame(newGame.code, newGame);     // add new game data to redis db
        }
        return newGames;    // Return all game create as JSON
    }

    async findOneGame(code): Promise<Game> {
        const gameString = await this.redisService.get(code);       // Find game with the code as redis key
        return JSON.parse(gameString) as Game;      // Return it with the good format
    }
}
