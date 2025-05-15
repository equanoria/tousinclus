import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

// ========== Service Import ==========
import { GameService } from 'src/game/game.service';

// ========== DTO Import ==========
import { ErrorCode, WSResponseDTO } from 'src/utils/dto/response.dto';
import { WSControllerDTO, WSDataDTO } from '../dto/websocket.dto';
import { GameDTO } from 'src/game/dto/game.dto';

@Injectable()
export class ResultService {
  constructor(private readonly gameService: GameService) {} // Injection of GameService

  async handleResultLogic(
    client: Socket,
    data: WSControllerDTO,
  ): Promise<void> {
    // Checking the action
    const { action, ...CData } = data;

    // Trigger the appropriate logic based on the action
    switch (action) {
      case 'get-result':
        // Call the method to handle team connection
        await this.getResultGame(client, CData);
        break;

      default: {
        // Emit an error in case of unrecognized action
        const responseData: WSResponseDTO = {
          status: 'error',
          errorCode: ErrorCode.VALIDATION_FAILED,
          message: `Unrecognized action "${action}"`,
          responseChannel: 'result-response',
        };
        throw new WsException(responseData);
      }
    }
  }

  private calculateScores(game: GameDTO): Record<string, number> {
    const score: Record<string, number> = {
      team1: 0,
      team2: 0,
    };

    for (const voteGroup of game.votes) {
      const voteCount: Record<string, number> = {
        team1: 0,
        team2: 0,
      };

      // Count the votes for this card
      for (const vote of voteGroup.votes) {
        if (vote.vote in voteCount) {
          voteCount[vote.vote]++;
        }
      }

      // Determine the winner for this card. PS: Normally, a consensus has been forced in debate phase.
      if (voteCount.team1 > voteCount.team2) {
        score.team1 += 1;
      } else if (voteCount.team2 > voteCount.team1) {
        score.team2 += 1;
      }
      // For later: If there is a tie, no points are awarded
    }

    return score;
  }

  async getResultGame(client: Socket, data: WSDataDTO): Promise<void> {
    // Call the service to retrieve game data
    const findOneGameData = await this.gameService.findOneGame(data.code);

    if (!findOneGameData) {
      const responseData: WSResponseDTO = {
        status: 'error',
        errorCode: ErrorCode.NOT_FOUND,
        message: `There is no game found with code "${data.code}"`,
        responseChannel: 'result-response',
      };
      throw new WsException(responseData);
    }

    const score = this.calculateScores(findOneGameData);

    const responseData: WSResponseDTO = {
      status: 'success',
      message: `You successfully retrieve result for game ${data.code}`,
      data: score,
    };

    client.emit('result-response', responseData);
  }
}
