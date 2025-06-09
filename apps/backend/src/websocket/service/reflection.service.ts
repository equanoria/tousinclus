import { BadRequestException, Injectable } from '@nestjs/common';

// ========== Service Import ==========
import { GameService } from 'src/game/game.service';

import { WsException } from '@nestjs/websockets';
// ========== WebSocket Import ==========
import { Socket } from 'socket.io';

import { plainToInstance } from 'class-transformer';
import { GameDTO } from 'src/game/dto/game.dto';
// ========== DTO Import ==========
import { ErrorCode, WSResponseDTO } from 'src/utils/dto/response.dto';
import { WSControllerDTO, WSDataDTO } from '../dto/websocket.dto';

@Injectable()
export class ReflectionService {
  constructor(private readonly gameService: GameService) {} // Injection of GameService

  async handleReflectionLogic(
    client: Socket,
    data: WSControllerDTO,
  ): Promise<void> {
    const { action, ...CData } = data;

    switch (action) {
      case 'get-answers':
        // Call the method to get sheet
        await this.getAnswers(client, CData);
        break;

      case 'update-answer':
        // Call the method to update-answer
        await this.updateAnswer(client, CData);
        break;

      default: {
        // Emit an error in case of unrecognized action
        const responseData: WSResponseDTO = {
          status: 'error',
          errorCode: ErrorCode.VALIDATION_FAILED,
          message: `Unrecognized action "${action}"`,
          responseChannel: 'reflection-response',
        };
        throw new WsException(responseData);
      }
    }
  }

  async getAnswers(client: Socket, data: WSDataDTO) {
    try {
      console.log(data);
      const game = await this.gameService.getTeamAnswer(
        data.code,
        data.team,
        client.id,
      );

      // Transformer l'objet en excluant les clés marquées
      const dataGame = plainToInstance(GameDTO, game, {
        excludeExtraneousValues: true,
        groups: ['room', 'reflection', client.data.team],
      });

      client.emit('reflection-response', {
        status: 'success',
        message: `You successfully retrieve answers for ${data.team} in game ${data.code}`,
        data: dataGame,
      });
    } catch (error) {
      const errorCode = ErrorCode.GENERIC_ERROR;

      const responseData: WSResponseDTO = {
        status: 'error',
        errorCode: errorCode,
        message: error.message,
        responseChannel: 'reflection-response',
      };
      throw new WsException(responseData);
    }
  }

  async updateAnswer(client: Socket, data: WSDataDTO) {
    try {
      if ('answer' in data.data) {
        await this.gameService.updateTeamAnswer(
          data.code,
          data.data.team,
          client.id,
          data.data,
        );

        // Emit success response to all connected clients
        client.emit('reflection-response', {
          status: 'success',
          message: `You successfully saved answer for card id: ${data.data.cardId}`,
          data: data.data,
        });
      } else {
        throw new BadRequestException(
          'Please provide field "data" to update answers',
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
        responseChannel: 'reflection-response',
      };
      throw new WsException(responseData);
    }
  }
}
