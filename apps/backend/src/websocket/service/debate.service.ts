import { BadRequestException, Injectable } from '@nestjs/common';

// ========== Service Import ==========
import { GameService } from 'src/game/game.service';

// ========== WebSocket Import ==========
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';

// ========== DTO Import ==========
import { WSResponseDTO, ErrorCode } from 'src/utils/dto/response.dto';
import { WSControllerDTO, WSDataDTO } from '../dto/websocket.dto';

@Injectable()
export class DebateService {
  constructor(private readonly gameService: GameService) {} // Injection of GameService

  async handleDebateLogic(
    client: Socket,
    data: WSControllerDTO,
  ): Promise<void> {
    const { action, ...CData } = data;

    // Trigger the appropriate logic based on the action
    switch (action) {
      case 'get-vote':
        // Call the method to get all vote
        client.emit('debate-response', {
          status: 'success',
          message: `You successfully retrieved all votes from ${data.code}`,
          data: CData,
        });
        break;

      case 'update-vote':
        // Call the method to get all vote
        await this.updateVote(client, CData);
        break;

      default: {
        // Emit an error in case of unrecognized action
        const responseData: WSResponseDTO = {
          status: 'error',
          errorCode: ErrorCode.VALIDATION_FAILED,
          message: `Unrecognized action "${action}"`,
          responseChannel: 'joining-response',
        };
        throw new WsException(responseData);
      }
    }
  }

  async updateVote(client: Socket, data: WSDataDTO): Promise<void> {
    try {
      if ('votes' in data.data) {
        await this.gameService.updateTeamVote(data.code, client.id, data.data);
      } else {
        throw new BadRequestException(
          'Please provide field "voteData" to update vote',
        );
      }

      client.emit('debate-response', {
        status: 'success',
        message: `You successfully update vote from ${data.data.cardId}`,
        data: data,
      });
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
