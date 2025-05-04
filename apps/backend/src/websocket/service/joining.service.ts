import { Injectable } from '@nestjs/common';

// ========== Service Import ==========
import { GameService } from 'src/game/game.service';

// ========== WebSocket Import ==========
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

// ========== DTO Import ==========
import { ErrorCode, WSResponseDTO } from 'src/utils/dto/response.dto';
import { WSControllerDTO, WSDataDTO } from '../dto/websocket.dto';
import { plainToInstance } from 'class-transformer';
import { GameDTO } from 'src/game/dto/game.dto';

@Injectable()
export class JoiningService {
  constructor(private readonly gameService: GameService) {} // Injection of GameService

  async handleJoiningLogic(
    client: Socket,
    data: WSControllerDTO,
  ): Promise<void> {
    // Checking the action
    const { action, ...CData } = data;

    // Trigger the appropriate logic based on the action
    switch (action) {
      case 'joining-game':
        // Call the method to handle team connection
        await this.handleJoiningGame(client, CData);
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

  async handleJoiningGame(client: Socket, data: WSDataDTO): Promise<void> {
    // Appeler le service pour récupérer les données du jeu
    const findOneGameData = await this.gameService.findOneGame(data.code);

    if (!findOneGameData) {
      const responseData: WSResponseDTO = {
        status: 'error',
        errorCode: ErrorCode.NOT_FOUND,
        message: `There is no game found with code "${data.code}"`,
        responseChannel: 'joining-response',
      };
      throw new WsException(responseData);
    }

    // Transformer l'objet en excluant les clés marquées
    const modifiedGameData = plainToInstance(GameDTO, findOneGameData, {
      excludeExtraneousValues: true,
      groups: ['joining'],
    });

    client.emit('joining-response', modifiedGameData);
  }
}
