import { BadRequestException, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ErrorCode, WSResponseDTO } from 'src/utils/dto/response.dto';
import { GameService } from 'src/game/game.service';
import { WSControllerDTO, WSDataDTO } from '../dto/websocket.dto';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class ReflectionService {
  constructor(private readonly gameService: GameService) {} // Injection of GameService

  async handleReflectionLogic(
    client: Socket,
    data: WSControllerDTO,
  ): Promise<void> {
    const { action, ...CData } = data;

    switch (action) {
      case 'get-answer':
        // Call the method to get sheet
        console.log(CData);
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

  async updateAnswer(client: Socket, data: WSDataDTO) {
    try {
      console.log(
        'Received data in updateAnswer',
        JSON.stringify(data, null, 2),
      );

      if (!data.data.answer) {
        throw new BadRequestException(
          'Please provide field "Data" to update answers',
        );
      }

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
