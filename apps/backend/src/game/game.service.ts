import { Injectable } from '@nestjs/common';

// ========== DTO Import ==========
import { CreateGameDTO, IGameDTO } from './dto/game.dto';

// ========== Service Import ==========
import { RedisService } from '../redis/redis.service';

@Injectable()
export class GameService {
  constructor(private readonly redisService: RedisService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private getRandomGroupId(deckIdData: number) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private generateNewGameData(deckIdData): IGameDTO {
    // const groupdId = getRandomGroupId(deckIdData)

    const newGame: IGameDTO = {
      code: ((Math.random() * 1e6) | 0).toString().padStart(6, '0'), // Generate a 6-digit numeric code
      status: 'waiting',
      cardGroupId: 1,
      team1: {
        isConnected: false,
      },
      team2: {
        isConnected: false,
      },
    };
    return newGame;
  }

  async createGame(createGameDto: CreateGameDTO): Promise<IGameDTO> {
    const newGame = this.generateNewGameData(createGameDto.deckId || null);
    await this.redisService.setGame(newGame.code, newGame); // add new game data to redis db
    return newGame; // Return the game create as JSON
  }

  async createManyGame(
    i: number,
    createGameDto: CreateGameDTO,
  ): Promise<IGameDTO[]> {
    const newGames: IGameDTO[] = [];
    for (let step = 0; step < i; step++) {
      const newGame = this.generateNewGameData(createGameDto.deckId || null); // Generate i game data
      newGames.push(newGame);
      await this.redisService.setGame(newGame.code, newGame); // add new game data to redis db
    }
    return newGames; // Return all game create as JSON
  }

  async findOneGame(code: IGameDTO['code']): Promise<IGameDTO> {
    const game = await this.redisService.getGame(code); // Find game with the code as redis key
    return game; // Return it with the good format
  }

  async findAllGames(): Promise<IGameDTO[]> {
    const games = await this.redisService.getAllGames(); // Retrieve all games from Redis
    return games;
  }

  async deleteOneGame(code: IGameDTO['code']): Promise<boolean> {
    const gameDelete = await this.redisService.deleteOneGame(code);
    return gameDelete;
  }

  // Update the status of a connected team
  async updateTeamConnectionStatus(
    code: IGameDTO['code'],
    team: string,
    clientId: string,
  ): Promise<IGameDTO> {
    const game = await this.findOneGame(code);

    if (!game) {
      throw new Error(`Game with code ${code} not found`);
    }

    const response: IGameDTO = {
      code: game.code,
      status: game.status,
      cardGroupId: game.cardGroupId,
    };

    if (team === 'team1') {
      if (game.team1.isConnected) {
        throw new Error(
          `Team 1 is already connected with client ID ${game.team1.clientId}`,
        );
      }
      game.team1.isConnected = true;
      game.team1.clientId = clientId; // Assign the uuid of the client
      response.team1 = game.team1; // Return only team1 data
    } else if (team === 'team2') {
      if (game.team2.isConnected) {
        throw new Error(
          `Team 2 is already connected with client ID ${game.team2.isConnected}`,
        );
      }
      game.team2.isConnected = true;
      game.team2.clientId = clientId; // Assign the uuid of the client
      response.team2 = game.team2; // Return only team2 data
    } else {
      throw new Error(`Invalid team specified: ${team}`);
    }

    await this.redisService.setGame(code, game); // Update the game state in Redis
    return response;
  }

  async updateTeamDisconnectStatus(
    code: IGameDTO['code'],
    team: string,
    clientId: string,
  ): Promise<IGameDTO> {
    const game = await this.findOneGame(code);

    if (!game) {
      throw new Error(`Game with code ${code} not found`);
    }

    if (team === 'team1') {
      if (game.team1.clientId !== clientId) {
        throw new Error(`Client ID ${clientId} is not connected to Team 1`);
      }
      game.team1.isConnected = false;
      game.team1.clientId = null; // Remove the client ID from team 1
    } else if (team === 'team2') {
      if (game.team2.clientId !== clientId) {
        throw new Error(`Client ID ${clientId} is not connected to Team 2`);
      }
      game.team2.isConnected = false;
      game.team2.clientId = null; // Remove the client ID from team 2
    } else {
      throw new Error(`Invalid team specified: ${team}`);
    }

    await this.redisService.setGame(code, game); // Update the game state in Redis
    return game;
  }

  async checkIfReadyToStart(code: IGameDTO['code']): Promise<boolean> {
    const game = await this.findOneGame(code);

    if (game.team1.isConnected && game.team2.isConnected) {
      game.status = 'start';
      await this.redisService.setGame(code, game); // Update the game state in Redis
      return true;
    }
    return false;
  }
}
