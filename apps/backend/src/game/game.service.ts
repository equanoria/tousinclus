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
            status: "waiting",
            isTeam1Connected: null,
            isTeam2Connected: null,
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

    // Mettre à jour le statut d'une équipe connectée
    async updateTeamConnectionStatus(code: string, team: 'team1' | 'team2', clientId: string): Promise<Game> {
        const game = await this.findOneGame(code);

        if (!game) {
            throw new Error(`Game with code ${code} not found`);
        }

        if (team === 'team1') {
            if (game.isTeam1Connected) {
            throw new Error(`Team 1 is already connected with client ID ${game.isTeam1Connected}`);
            }
            game.isTeam1Connected = clientId; // Assign the uuid of the client
        } else if (team === 'team2') {
            if (game.isTeam2Connected) {
            throw new Error(`Team 2 is already connected with client ID ${game.isTeam2Connected}`);
            }
            game.isTeam2Connected = clientId; // Assign the uuid of the client
        }

        await this.redisService.setGame(code, game); // Update the game state in Redis
        return game;
    }
}
