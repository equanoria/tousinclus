import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { WSResponseDTO } from 'src/utils/dto/response.dto';
import { GameService } from 'src/game/game.service';
import { ReflectionDataDTO } from '../dto/websocket.dto';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class ReflectionService {
  constructor(private readonly gameService: GameService) {} // Injection of GameService

  async handleReflectionLogic(
    server: Server,
    client: Socket,
    data: ReflectionDataDTO,
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

      default:
        // Emit an error in case of unrecognized action
        client.emit('reflection-response', {
          status: 'error',
          message: 'Action non reconnue',
          action,
        });
    }
  }

  async updateAnswer(client: Socket, data: ReflectionDataDTO) {
    try {
      console.log(
        'Received data in updateAnswer',
        JSON.stringify(data, null, 2),
      );

      if (!data.data.cardId || !data.data.answer) {
        throw new WsException('Missing required fields: cardId or answer');
      }

      await this.gameService.updateTeamAnswer(
        data.code,
        data.team,
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
      console.error(`Error updating team connection: ${error.message}`);

      // Handle specific cases
      let errorCode = 'GENERIC_ERROR';
      if (error.message.includes('Missing required fields')) {
        errorCode = 'MISSING_FIELDS';
      } else if (error.message.includes('not found')) {
        errorCode = 'NOT_FOUND';
      } else if (error.message.includes('forbidden')) {
        errorCode = 'FORBIDDEN';
      }

      const responseData: WSResponseDTO = {
        status: 'error',
        message: error.message,
        error: errorCode,
      };
      // Send a structured error response to the client
      client.emit('reflection-response', responseData);
    }
  }
}
