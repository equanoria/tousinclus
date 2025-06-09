import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { EDebateStatus, EGameStatus, ETeam, IUser } from '@tousinclus/types';
// ========== DTO / Types Import ==========
import { AnswerDTO, CreateGameDTO, GameDTO, VoteDTO } from './dto/game.dto';

// ========== Mongo Import ==========
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GameDocument, IGameMongo } from './schema/game.schema';

import { DirectusService } from 'src/directus/directus.service';
// ========== Service Import ==========
import { RedisService } from '../redis/redis.service';

// ========== Lib Import ==========
import { Parser } from 'json2csv';

@Injectable()
export class GameService {
  constructor(
    @InjectModel('Game')
    private readonly gameModel: Model<GameDocument>,
    private readonly redisService: RedisService,
    private readonly directusService: DirectusService,
  ) {}

  public async getRandomGroupId(deckIdData: number): Promise<number> {
    const deckData = await this.directusService.getDeckById(deckIdData);

    if (!Array.isArray(deckData) || deckData.length === 0) {
      return null; // Retourne null si aucun ID disponible
    }

    const randomIndex = Math.floor(Math.random() * deckData.length); // Génère un index aléatoire
    return deckData[randomIndex] as number; // Retourne l'ID aléatoire
  }

  private async generateNewGameData(
    createGameData: CreateGameDTO,
    user: IUser,
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
      createdAt: new Date(),
      createdBy: user.id,
      reflectionEndsAt: null,
      _id: undefined,
      code: ((Math.random() * 1e6) | 0).toString().padStart(6, '0'), // Generate a 6-digit numeric code
      status: EGameStatus.WAITING,
      reflectionDuration: reflectionDuration,
      deckId: deckId,
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

  async createGame(
    createGameDto: CreateGameDTO,
    user: IUser,
  ): Promise<GameDTO> {
    const newGame = await this.generateNewGameData(createGameDto || null, user);

    // Create game record and update the mongoId when it's created
    const createdGame = await this.gameModel.create(newGame);
    newGame._id = String(createdGame._id);

    await this.redisService.setGame(newGame.code, newGame); // add new game data to redis
    return newGame; // Return the game create as JSON
  }

  async createManyGame(
    i: number,
    createGameDto: CreateGameDTO,
    user: IUser,
  ): Promise<GameDTO[]> {
    const newGames: GameDTO[] = [];
    for (let step = 0; step < i; step++) {
      const newGame = await this.generateNewGameData(
        createGameDto || null,
        user,
      ); // Generate i game data
      newGames.push(newGame);
      await this.redisService.setGame(newGame.code, newGame); // add new game data to redis db
    }
    return newGames; // Return all game create as JSON
  }

  async restartGame(code: string) {
    // Call the service to retrieve game data
    const findOneGameData = await this.findOneGame(code);

    // Retrieve the same DeckId from the previous game
    const deckId = findOneGameData.deckId;

    // Get new groupdId
    const groupId = await this.getRandomGroupId(deckId);

    if (groupId === null) {
      throw new NotFoundException(`Specified deck with id ${deckId} not found`);
    }

    if (findOneGameData.status !== EGameStatus.WAITING) {
      // Reset all game data
      const restartedGame: GameDTO = {
        createdAt: new Date(),
        createdBy: findOneGameData.createdBy,
        reflectionEndsAt: null,
        _id: undefined,
        code: findOneGameData.code,
        status: EGameStatus.WAITING,
        reflectionDuration: findOneGameData.reflectionDuration,
        deckId: deckId,
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

      const createdGame = await this.gameModel.create(restartedGame); // Add the new game in mongoDB
      restartedGame._id = String(createdGame._id); // Set the new mongID

      await this.redisService.setGame(restartedGame.code, restartedGame); // Overide the old game data with a fresh one

      return restartedGame;
    }

    return findOneGameData;
  }

  async findOneGame(code: GameDTO['code']): Promise<GameDTO> {
    const game = await this.redisService.getGame(code); // Find game with the code as redis key

    if (!game) {
      // If game is not found
      throw new Error(`Game with code ${code} not found`);
    }

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

  async findVoteByCardID(votes: VoteDTO[], cardId: number): Promise<VoteDTO> {
    return votes.find((entry) => entry.cardId === cardId);
  }

  // Update the status of a connected team
  async updateTeamConnectionStatus(
    code: GameDTO['code'],
    team: string,
    clientId: string,
  ): Promise<GameDTO> {
    const game = await this.findOneGame(code);

    if (game.team1.clientId === clientId || game.team2.clientId === clientId) {
      throw new ForbiddenException(
        `Your client ID ${game.team1.clientId} is already connected`,
      );
    }

    if (team === ETeam.TEAM1) {
      if (game.team1.isConnected) {
        throw new ForbiddenException(
          `Team 1 is already connected with client ID ${game.team1.clientId}`,
        );
      }
      game.team1.isConnected = true;
      game.team1.clientId = clientId; // Assign the uuid of the client
    } else if (team === ETeam.TEAM2) {
      if (game.team2.isConnected) {
        throw new ForbiddenException(
          `Team 2 is already connected with client ID ${game.team2.isConnected}`,
        );
      }
      game.team2.isConnected = true;
      game.team2.clientId = clientId; // Assign the uuid of the client
    } else {
      throw new BadRequestException(`Invalid team specified: ${team}`);
    }

    await this.redisService.setGame(code, game); // Update the game state in Redis

    return game;
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

    if (team === ETeam.TEAM1) {
      if (game.team1.clientId !== clientId) {
        throw new Error(`Client ID ${clientId} is not connected to Team 1`);
      }
      game.team1.isConnected = false;
      game.team1.clientId = null; // Remove the client ID from team 1
    } else if (team === ETeam.TEAM2) {
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

  async updateReflectionEndsAt(
    code: GameDTO['code'],
    reflectionEndsAt: GameDTO['reflectionEndsAt'],
  ): Promise<void> {
    const game = await this.findOneGame(code);
    if (!game) {
      throw new NotFoundException(`Game with code ${code} not found`);
    }

    game.reflectionEndsAt = reflectionEndsAt;
    await this.redisService.setGame(code, game);
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

  async getTeamAnswer(
    code: GameDTO['code'],
    team: string,
    clientId: string,
  ): Promise<GameDTO> {
    try {
      const game = await this.findOneGame(code);

      if (game.status !== 'reflection' && game.status !== 'debate') {
        // If game status doesn't match with action
        throw new Error(
          `Forbidden: game with code ${code} is not in the 'reflection' or 'debate' status`,
        );
      }

      // only filter answers when reflection phase
      if (game.status === 'reflection') {
        if (team === ETeam.TEAM1) {
          if (game.team1.clientId !== clientId) {
            throw new Error(`Client ID ${clientId} is not connected to Team 1`);
          }

          // Filter only team1 answers
          game.answers = game.answers.filter(
            (answer) => answer.team !== ETeam.TEAM2,
          );
        } else if (team === ETeam.TEAM2) {
          if (game.team2.clientId !== clientId) {
            throw new Error(`Client ID ${clientId} is not connected to Team 2`);
          }

          // Filter only team2 answers
          game.answers = game.answers.filter(
            (answer) => answer.team !== ETeam.TEAM1,
          );
        } else {
          throw new Error(`Invalid team specified: ${team}`);
        }
      }

      return game;
    } catch (error) {
      if (!error.message) {
        error.message =
          'Failed to update team answer. Please check "game.service.ts".';
      }

      throw error;
    }
  }

  async updateTeamAnswer(
    code: GameDTO['code'],
    team: string,
    clientId: string,
    data: AnswerDTO,
  ): Promise<GameDTO> {
    try {
      const game = await this.findOneGame(code);

      if (game.status !== 'reflection') {
        // If game status doesn't match with action
        throw new Error(
          `Forbidden game with code ${code} is not in the 'reflection' status`,
        );
      }

      if (team === ETeam.TEAM1) {
        if (game.team1.clientId !== clientId) {
          throw new Error(`Client ID ${clientId} is not connected to Team 1`);
        }

        const existingAnswer = game.answers.find(
          (entry) => entry.cardId === data.cardId && entry.team === ETeam.TEAM1,
        );

        if (existingAnswer) {
          // Update the existing answer
          existingAnswer.answer = data.answer;
        } else {
          // Add a new answer
          game.answers.push({
            cardId: data.cardId,
            team: team,
            answer: data.answer,
          });
        }
      } else if (team === ETeam.TEAM2) {
        if (game.team2.clientId !== clientId) {
          throw new Error(`Client ID ${clientId} is not connected to Team 2`);
        }

        const existingAnswer = game.answers.find(
          (entry) => entry.cardId === data.cardId && entry.team === ETeam.TEAM2,
        );

        if (existingAnswer) {
          // Update the existing answer
          existingAnswer.answer = data.answer;
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

      // Check if data.cardId already exists in votes
      const existingVote = await this.findVoteByCardID(game.votes, data.cardId);

      if (!existingVote) {
        // Add a new vote entry if it doesn't exist
        game.votes.push({
          cardId: data.cardId,
          votes: [],
        });
      }

      await this.redisService.setGame(code, game); // Update the game state in Redis
      return game;
    } catch (error) {
      if (!error.message) {
        error.message =
          'Failed to update team answer. Please check "game.service.ts".';
      }

      throw error;
    }
  }

  async updateTeamVote(
    code: GameDTO['code'],
    clientId: string,
    data: VoteDTO,
  ): Promise<GameDTO> {
    try {
      const game = await this.findOneGame(code);

      let userTeam = data.votes[0].team;

      if (game.status !== 'debate') {
        // If game status doesn't match with action
        throw new Error(
          `Forbidden game with code ${code} is not in the 'debate' status`,
        );
      }

      // Check if data.cardId already exists in votes
      const existingVote = await this.findVoteByCardID(game.votes, data.cardId);
      if (!existingVote) {
        throw new Error(`No existing vote found for card ID: ${data.cardId}`);
      }

      // Check if the client connected is truely the one who want's to update
      if (userTeam === ETeam.TEAM1) {
        if (game.team1.clientId !== clientId) {
          throw new Error(`Client ID ${clientId} is not connected to Team 1`);
        }
        userTeam = ETeam.TEAM1;
      } else if (userTeam === ETeam.TEAM2) {
        if (game.team2.clientId !== clientId) {
          throw new Error(`Client ID ${clientId} is not connected to Team 2`);
        }
        userTeam = ETeam.TEAM2;
      }

      // Vérifier si un vote existe déjà pour cette team, et le modifier si besoin
      const voteIndex = existingVote.votes.findIndex(
        (v) => v.team === userTeam,
      );
      if (voteIndex >= 0) {
        throw new Error(
          `Forbidden you already have voted for this game (code : ${code})`,
        );
      }
      existingVote.votes.push(data.votes[0]);

      await this.redisService.setGame(code, game); // Update the game state in Redis
      return game;
    } catch (error) {
      if (!error.message) {
        error.message =
          'Failed to update team answer. Please check "game.service.ts".';
      }

      throw error;
    }
  }

  async checkConsensusVote(code: GameDTO['code'], cardId: VoteDTO['cardId']) {
    const REQUIRED_CARDS_COUNT = 6;
    const game = await this.findOneGame(code);

    // Sort the votes by cardId in ascending order
    const sortedVotes = game.votes.sort((a, b) => a.cardId - b.cardId);

    if (cardId) {
      // If a specific card ID is provided, find the corresponding vote
      const existingVote = sortedVotes.find((vote) => vote.cardId === cardId);

      // Check if both teams agree on the same vote
      if (existingVote && existingVote.votes.length === 2) {
        const allVotes = existingVote.votes.map((vote) => vote.vote);

        // If both teams voted the same, consensus is reached
        if (allVotes.every((vote) => vote === allVotes[0])) {
          //Find the nextCard
          const nextCard = sortedVotes.find((vote) => vote.cardId > cardId);
          if (nextCard) {
            return {
              eventType: EDebateStatus.NEXT_CARD,
              message:
                'Consensus reached for the current card. Proceed to the next card.',
              nextCardId: nextCard.cardId,
            };
          }

          // Condition to result phase
          if (sortedVotes.length === REQUIRED_CARDS_COUNT) {
            // Check if all cards have 2 votes
            const allHaveTwoVotes = sortedVotes.every(
              (vote) => vote.votes.length === 2,
            );

            if (allHaveTwoVotes) {
              return {
                eventType: EDebateStatus.END_PHASE,
                message:
                  'Consensus reached for the current card. No more cards remaining.',
                displayResult: true,
              };
            }
          }
        }
        // If teams didn't vote the same, consensus is not reached
        // Reset votes (flush votes)
        existingVote.votes = [];
        await this.redisService.setGame(code, game); // Update the game state in Redis

        // So return error message with the same cardId to retry
        return {
          eventType: EDebateStatus.RETRY,
          message:
            'Consensus not reached for the current card. Please you need to vote again.',
          nextCardId: cardId,
        };
      }
    } else {
      // Find the first card without consensus
      const firstWithoutConsensus = sortedVotes.find(
        (vote) =>
          vote.votes.length < 2 || // Not enough votes
          !vote.votes.every((v) => v.vote === vote.votes[0].vote), // Votes are not unanimous
      );

      if (firstWithoutConsensus) {
        return {
          eventType: EDebateStatus.NEXT_CARD,
          message: 'Next card to vote on identified.',
          nextCardId: firstWithoutConsensus.cardId,
        };
      }
      return {
        eventType: EDebateStatus.END_PHASE,
        message: 'All cards have reached consensus.',
      };
    }
  }

  async updateMongoGame(code: GameDTO['code']) {
    const mongoGameData: IGameMongo = await this.findOneGame(code);

    const updatedGame = await this.gameModel.findByIdAndUpdate(
      mongoGameData._id,
      mongoGameData,
      { new: true }, // return updated record
    );

    return updatedGame;
  }

  async exportGameByDate(targetDate: Date) {
    const nextDay = new Date(targetDate);
    nextDay.setDate(targetDate.getDate() + 1);

    const games = await this.gameModel
      .find({
        createdAt: {
          $gte: targetDate,
          $lt: nextDay,
        },
      })
      .lean(); // lean() pour avoir des objets JS simples

    if (games.length === 0) {
      return ''; // ou gérer autrement si aucun résultat
    }

    // Extraire les createdBy uniques
    const createdByUniqueIds = Array.from(
      new Set(games.map((g) => g.createdBy)),
    );

    // Appel à Directus pour récupérer noms et prénoms
    const users =
      await this.directusService.getFirstLastNameById(createdByUniqueIds);

    // Créer un dictionnaire pour un mapping rapide
    const userMap = new Map(
      users.map((user) => [user.id, `${user.first_name} ${user.last_name}`]),
    );

    // Génération du CSV avec noms
    const flatGames = games.map((game) => {
      let score_team1 = 0;
      let score_team2 = 0;

      for (const voteGroup of game.votes || []) {
        let team1Votes = 0;
        let team2Votes = 0;

        for (const vote of voteGroup.votes || []) {
          if (vote.vote === 'team1') team1Votes++;
          else if (vote.vote === 'team2') team2Votes++;
        }

        if (team1Votes > team2Votes) score_team1++;
        else if (team2Votes > team1Votes) score_team2++;
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

    const parser = new Parser({ fields });
    const csv = parser.parse(flatGames);

    return csv;
  }
}
