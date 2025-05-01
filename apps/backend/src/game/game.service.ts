import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

// ========== DTO / Types Import ==========
import { AnswerDTO, CreateGameDTO, GameDTO } from './dto/game.dto';
import { EGameStatus, ETeam } from '@tousinclus/types';

// ========== Service Import ==========
import { RedisService } from '../redis/redis.service';
import { DirectusService } from 'src/directus/directus.service';

@Injectable()
export class GameService {
  constructor(
    private readonly redisService: RedisService,
    private readonly directusService: DirectusService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async getRandomGroupId(deckIdData: number): Promise<number> {
    const deckData = await this.directusService.getDeckById(deckIdData);

    if (!Array.isArray(deckData) || deckData.length === 0) {
      return null; // Retourne null si aucun ID disponible
    }

    const randomIndex = Math.floor(Math.random() * deckData.length); // Génère un index aléatoire
    return deckData[randomIndex] as number; // Retourne l'ID aléatoire
  }

  private async generateNewGameData(
    createGameData: CreateGameDTO,
  ): Promise<GameDTO> {
    const deckId =
      createGameData.deckId ?? (await this.directusService.getDeckDefault());

    const reflectionDuration =
      createGameData.reflectionDuration ??
      (await this.directusService.getReflectionDurationDefault());

    const groupId = await this.getRandomGroupId(deckId);

    if (groupId === null) {
      throw new NotFoundException(
        `Specified deck with id ${createGameData.deckId} not found`,
      );
    }

    const newGame: GameDTO = {
      code: ((Math.random() * 1e6) | 0).toString().padStart(6, '0'), // Generate a 6-digit numeric code
      status: EGameStatus.Waiting,
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

  async createGame(createGameDto: CreateGameDTO): Promise<GameDTO> {
    const newGame = this.generateNewGameData(createGameDto || null);
    await this.redisService.setGame((await newGame).code, await newGame); // add new game data to redis db
    return newGame; // Return the game create as JSON
  }

  async createManyGame(
    i: number,
    createGameDto: CreateGameDTO,
  ): Promise<GameDTO[]> {
    const newGames: GameDTO[] = [];
    for (let step = 0; step < i; step++) {
      const newGame = await this.generateNewGameData(createGameDto || null); // Generate i game data
      newGames.push(newGame);
      await this.redisService.setGame(newGame.code, newGame); // add new game data to redis db
    }
    return newGames; // Return all game create as JSON
  }

  async findOneGame(code: GameDTO['code']): Promise<GameDTO> {
    const game = await this.redisService.getGame(code); // Find game with the code as redis key
    return game; // Return it with the good format
  }

  async findAllGames(): Promise<GameDTO[]> {
    const games = await this.redisService.getAllGames(); // Retrieve all games from Redis
    return games;
  }

  async deleteOneGame(code: GameDTO['code']): Promise<boolean> {
    const gameDelete = await this.redisService.deleteOneGame(code);
    return gameDelete;
  }

  async deleteAllGames(): Promise<GameDTO[]> {
    const result = await this.redisService.deleteAllGames(); // Delete all games from Redis
    return result;
  }

  // Update the status of a connected team
  async updateTeamConnectionStatus(
    code: GameDTO['code'],
    team: string,
    clientId: string,
  ): Promise<GameDTO> {
    const game = await this.findOneGame(code);

    if (!game) {
      throw new NotFoundException(`Game with code ${code} not found`);
    }

    const response: GameDTO = {
      code: game.code,
      status: game.status,
      reflectionDuration: game.reflectionDuration,
      cardGroupId: game.cardGroupId,
    };

    if (team === ETeam.team1) {
      if (game.team1.isConnected) {
        throw new ForbiddenException(
          `Team 1 is already connected with client ID ${game.team1.clientId}`,
        );
      }
      game.team1.isConnected = true;
      game.team1.clientId = clientId; // Assign the uuid of the client
      response.team1 = game.team1; // Return only team1 data
    } else if (team === ETeam.team2) {
      if (game.team2.isConnected) {
        throw new ForbiddenException(
          `Team 2 is already connected with client ID ${game.team2.isConnected}`,
        );
      }
      game.team2.isConnected = true;
      game.team2.clientId = clientId; // Assign the uuid of the client
      response.team2 = game.team2; // Return only team2 data
    } else {
      throw new BadRequestException(`Invalid team specified: ${team}`);
    }

    await this.redisService.setGame(code, game); // Update the game state in Redis
    return response;
  }

  async updateTeamDisconnectStatus(
    code: GameDTO['code'],
    team: string,
    clientId: string,
  ): Promise<GameDTO> {
    const game = await this.findOneGame(code);

    if (!game) {
      throw new Error(`Game with code ${code} not found`);
    }

    if (team === ETeam.team1) {
      if (game.team1.clientId !== clientId) {
        throw new Error(`Client ID ${clientId} is not connected to Team 1`);
      }
      game.team1.isConnected = false;
      game.team1.clientId = null; // Remove the client ID from team 1
    } else if (team === ETeam.team2) {
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

  async checkIfReadyToStart(code: GameDTO['code']): Promise<boolean> {
    const game = await this.findOneGame(code);
    if (!game) {
      throw new Error(`Game with code ${code} not found`);
    }

    if (game.team1.isConnected && game.team2.isConnected) {
      await this.redisService.setGame(code, game); // Update the game state in Redis
      return true;
    }
    return false;
  }

  async updateGameStatus(
    code: GameDTO['code'],
    status: GameDTO['status'],
  ): Promise<void> {
    const game = await this.findOneGame(code);
    if (!game) {
      throw new NotFoundException(`Game with code ${code} not found`);
    }

    game.status = status;
    await this.redisService.setGame(code, game); // Update the game state in Redis
  }

  async updateTeamAnswer(
    code: GameDTO['code'],
    team: string,
    clientId: string,
    data: AnswerDTO,
  ): Promise<GameDTO> {
    try {
      const game = await this.findOneGame(code);

      if (!game) {
        // If game is not found
        throw new Error(`Game with code ${code} not found`);
      }

      if (game.status !== 'reflection') {
        // If game status doesn't match with action
        throw new Error(
          `Forbidden game with code ${code} is not in the 'reflection' status`,
        );
      }

      if (team === ETeam.team1) {
        if (game.team1.clientId !== clientId) {
          throw new Error(`Client ID ${clientId} is not connected to Team 1`);
        }

        const existingAnswerIndex = game.answers.findIndex(
          (entry) =>
            entry.cardId === data.cardId && entry.team === ETeam.team1,
        );

        if (existingAnswerIndex !== -1) {
          // Update the existing answer
          game.answers[existingAnswerIndex].answer = data.answer;
        } else {
          // Add a new answer
          game.answers.push({
            cardId: data.cardId,
            team: team,
            answer: data.answer,
          });
        }
      } else if (team === ETeam.team2) {
        if (game.team2.clientId !== clientId) {
          throw new Error(`Client ID ${clientId} is not connected to Team 2`);
        }

        const existingAnswerIndex = game.answers.findIndex(
          (entry) =>
            entry.cardId === data.cardId && entry.team === ETeam.team2,
        );

        if (existingAnswerIndex !== -1) {
          // Update the existing answer
          game.answers[existingAnswerIndex].answer = data.answer;
        } else {
          // Add a new answer
          game.answers.push({
            cardId: data.cardId,
            team: team,
            answer: data.answer,
          });
        }
      } else {
        throw new Error(`Invalid team specified: ${team}`);
      }

      // Check if data.cardId already exist in votes
      const existingVotesIndex = game.votes.findIndex(
        (entry) => entry.cardId === data.cardId,
      );

      if (existingVotesIndex === -1) {
        // Add a new vote entry if it doesn't exist
        game.votes.push({
          cardId: data.cardId,
          team: team,
          vote: [],
        });
      }

      await this.redisService.setGame(code, game); // Update the game state in Redis
      return game;
    } catch (error) {
      if (error instanceof Error && error.message) {
        throw new Error(error.message);
      }

      // Handle the error gracefully to avoid websocket disconnection
      throw new Error(
        'Failed to update team answer. Please check "game.service.ts".',
      );
    }
  }
}
