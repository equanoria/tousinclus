import { Injectable } from '@nestjs/common';

// ========== WebSocket Import ==========
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';

// ========== DTO Import ==========
import { WSResponseDTO, ErrorCode } from 'src/utils/dto/response.dto';
import { WSControllerDTO } from '../dto/websocket.dto';

@Injectable()
export class DebateService {
  async handleDebateLogic(
    client: Socket,
    data: WSControllerDTO,
  ): Promise<void> {
    const { action, ...CData } = data;

    // Trigger the appropriate logic based on the action
    switch (action) {
      case 'get-vote':
        // Call the method to get all vote
        client.emit('waiting-response', {
          status: 'success',
          message: `You successfully retrieved all votes from ${data.code}`,
          data: CData,
        });
        break;

      case 'update-vote':
        // Call the method to get all vote
        client.emit('waiting-response', {
          status: 'success',
          message: `You successfully update vote from ${data.data.cardId}`,
          data: CData,
        });
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
}
