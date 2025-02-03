import { Injectable } from '@nestjs/common';
import type { RedisService } from '../redis/redis.service';
import type { Game } from './interfaces/game.interface';

@Injectable()
export class GameService {
  constructor(private readonly redisService: RedisService) {}

  private generateNewGameData(): Game {
    const newGame: Game = {
      code: Math.floor(100000 + Math.random() * 900000).toString(), // Generate a 6-digit numeric code
      status: 'waiting',
      isTeam1Connected: null,
      isTeam2Connected: null,
    };
    return newGame;
  }

  async createGame(): Promise<Game> {
    const newGame = this.generateNewGameData();
    await this.redisService.setGame(newGame.code, newGame); // add new game data to redis db
    return newGame; // Return the game create as JSON
  }

  async createManyGame(i: number): Promise<Game[]> {
    const newGames: Game[] = [];
    for (let step = 0; step < i; step++) {
      const newGame = this.generateNewGameData(); // Generate i game data
      newGames.push(newGame);
      await this.redisService.setGame(newGame.code, newGame); // add new game data to redis db
    }
    return newGames; // Return all game create as JSON
  }

  async findOneGame(code: string): Promise<Game> {
    const game = await this.redisService.getGame(code); // Find game with the code as redis key
    return game; // Return it with the good format
  }

  async findAllGames(): Promise<Game[]> {
    const games = await this.redisService.getAllGames(); // Retrieve all games from Redis
    return games;
  }

  async deleteOneGame(code: string): Promise<boolean> {
    const gameDelete = await this.redisService.deleteOneGame(code);
    return gameDelete;
  }

  // Mettre à jour le statut d'une équipe connectée
  async updateTeamConnectionStatus(
    code: string,
    team: string,
    clientId: string,
  ): Promise<Game> {
    const game = await this.findOneGame(code);

    if (!game) {
      throw new Error(`Game with code ${code} not found`);
    }

    if (team === 'team1') {
      if (game.isTeam1Connected) {
        throw new Error(
          `Team 1 is already connected with client ID ${game.isTeam1Connected}`,
        );
      }
      game.isTeam1Connected = clientId; // Assign the uuid of the client
    } else if (team === 'team2') {
      if (game.isTeam2Connected) {
        throw new Error(
          `Team 2 is already connected with client ID ${game.isTeam2Connected}`,
        );
      }
      game.isTeam2Connected = clientId; // Assign the uuid of the client
    } else {
      throw new Error(`Invalid team specified: ${team}`);
    }

    await this.redisService.setGame(code, game); // Update the game state in Redis
    return game;
  }

  async updateTeamDisconnectStatus(
    code: string,
    team: string,
    clientId: string,
  ): Promise<Game> {
    const game = await this.findOneGame(code);

    if (!game) {
      throw new Error(`Game with code ${code} not found`);
    }

    if (team === 'team1') {
      if (game.isTeam1Connected !== clientId) {
        throw new Error(`Client ID ${clientId} is not connected to Team 1`);
      }
      game.isTeam1Connected = null; // Remove the client ID from team 1
    } else if (team === 'team2') {
      if (game.isTeam2Connected !== clientId) {
        throw new Error(`Client ID ${clientId} is not connected to Team 2`);
      }
      game.isTeam2Connected = null; // Remove the client ID from team 2
    } else {
      throw new Error(`Invalid team specified: ${team}`);
    }

    await this.redisService.setGame(code, game); // Update the game state in Redis
    return game;
  }

  async checkIfReadyToStart(code: string): Promise<boolean> {
    const game = await this.findOneGame(code);

    if (game.isTeam1Connected && game.isTeam2Connected) {
      game.status = 'start';
      await this.redisService.setGame(code, game); // Update the game state in Redis
      return true;
    }
    return false;
  }
}
