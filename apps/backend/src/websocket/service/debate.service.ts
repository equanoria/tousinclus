import { BadRequestException, Injectable } from '@nestjs/common';
import { EGameStatus } from '@tousinclus/types';

// ========== Service Import ==========
import { GameService } from 'src/game/game.service';

import { WsException } from '@nestjs/websockets';
// ========== WebSocket Import ==========
import { Server, Socket } from 'socket.io';

// ========== DTO Import ==========
import { ErrorCode, WSResponseDTO } from 'src/utils/dto/response.dto';
import { WSControllerDTO, WSDataDTO, WSGameStatus } from '../dto/websocket.dto';

@Injectable()
export class DebateService {
  constructor(private readonly gameService: GameService) {} // Injection of GameService

  async handleDebateLogic(
    server: Server,
    client: Socket,
    data: WSControllerDTO,
  ): Promise<void> {
    const { action, ...CData } = data;

    // Trigger the appropriate logic based on the action
    switch (action) {
      case 'get-vote':
        // Call the method to get card to vote
        await this.getVote(client, CData);
        break;
      case 'update-vote':
        // Call the method to update a vote
        await this.updateVote(server, client, CData);
        break;

      default: {
        // Emit an error in case of unrecognized action
        const responseData: WSResponseDTO = {
          status: 'error',
          errorCode: ErrorCode.VALIDATION_FAILED,
          message: `Unrecognized action "${action}"`,
          responseChannel: 'debate-response',
        };
        throw new WsException(responseData);
      }
    }
  }

  async getVote(client: Socket, data: WSDataDTO) {
    try {
      const nextCardToVote = await this.gameService.checkConsensusVote(
        data.code,
        null,
      );

      const game = await this.gameService.getTeamAnswer(
        data.code,
        data.team,
        client.id,
      );

      // Filter answers with cardId equal to nextCardToVote.nextCardId
      const dataGameAnswers = game.answers.filter(
        (answer) => answer.cardId === nextCardToVote.nextCardId,
      );

      // Send websockets only if a consensus is found
      if (nextCardToVote) {
        const responseData = {
          status: 'success',
          message: nextCardToVote.message,
          data: {
            eventType: nextCardToVote.eventType,
            nextCardId: nextCardToVote.nextCardId
              ? nextCardToVote.nextCardId
              : null,
            answers: dataGameAnswers ? dataGameAnswers : null,
          },
        };
        client.emit('debate-response', responseData);
      }
    } catch (error) {
      let errorCode = ErrorCode.GENERIC_ERROR;

      if (error instanceof BadRequestException) {
        errorCode = ErrorCode.BAD_REQUEST;
      }

      const responseData: WSResponseDTO = {
        status: 'error',
        errorCode: errorCode,
        message: error.message,
        responseChannel: 'debate-response',
      };
      throw new WsException(responseData);
    }
  }

  async updateVote(
    server: Server,
    client: Socket,
    data: WSDataDTO,
  ): Promise<void> {
    try {
      if ('votes' in data.data) {
        await this.gameService.updateTeamVote(data.code, client.id, data.data);
        client.emit('debate-response', {
          status: 'success',
          message: `You successfully update vote from card ${data.data.cardId}`,
          data: data,
        });

        const nextCardToVote = await this.gameService.checkConsensusVote(
          data.code,
          data.data.cardId,
        );

        const game = await this.gameService.getTeamAnswer(
          data.code,
          data.team,
          client.id,
        );

        // Send websockets only if a consensus is found
        if (nextCardToVote?.message) {
          // Filter answers with cardId equal to nextCardToVote.nextCardId
          const dataGameAnswers = game.answers.filter(
            (answer) => answer.cardId === nextCardToVote.nextCardId,
          );

          const responseData: WSResponseDTO = {
            status: 'success',
            message: nextCardToVote.message,
            data: {
              eventType: nextCardToVote.eventType,
              nextCardId: nextCardToVote.nextCardId
                ? nextCardToVote.nextCardId
                : null,
              answers: dataGameAnswers ? dataGameAnswers : null,
            },
          };
          server.to(data.code).emit('debate-response', responseData);

          // If displayResult change game phase to result
          if (nextCardToVote?.displayResult) {
            await this.gameService.updateGameStatus(
              data.code,
              EGameStatus.RESULT,
            );
            await this.gameService.updateMongoGame(data.code);

            const responseData: WSGameStatus = {
              gameStatus: EGameStatus.RESULT,
            };
            server.to(data.code).emit('game-status', responseData);
          }
        }
      } else {
        throw new BadRequestException(
          'Please provide field "voteData" to update vote',
        );
      }
    } catch (error) {
      let errorCode = ErrorCode.GENERIC_ERROR;

      if (error instanceof BadRequestException) {
        errorCode = ErrorCode.BAD_REQUEST;
      }

      const responseData: WSResponseDTO = {
        status: 'error',
        errorCode: errorCode,
        message: error.message,
        responseChannel: 'debate-response',
      };
      throw new WsException(responseData);
    }
  }
}
