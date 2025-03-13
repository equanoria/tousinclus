import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

// ========== Service Import ==========
import { GameService } from 'src/game/game.service';

// ========== DTO Import ==========
import { IWSResponseDTO } from 'src/utils/dto/response.dto';
import { IWSDataDTO } from '../dto/websocket.dto';
import { plainToInstance } from 'class-transformer';
import { IGameDTO } from 'src/game/dto/game.dto';

@Injectable()
export class JoiningService {
  constructor(private readonly gameService: GameService) {} // Injection of GameService

  async handleJoiningLogic(client: Socket, data: IWSDataDTO): Promise<void> {
    if (!data.code) {
      const responseData: IWSResponseDTO = {
        status: 'error',
        error: 'No game code specified',
        message: 'Please specify it in the JSON with key "code"',
      };
      client.emit('joining-response', responseData);
      throw new WsException(
        'No game code specified in the JSON with key `code`',
      );
    }

    try {
      // Appeler le service pour récupérer les données du jeu
      const findOneGameData = await this.gameService.findOneGame(data.code);

      if (!findOneGameData) {
        const responseData: IWSResponseDTO = {
          status: 'error',
          error: 'No game found',
          message: `There is no game found with code "${data.code}"`,
        };
        client.emit('joining-response', responseData);
        throw new WsException(`No game found with code "${data.code}"`);
      }

      // Transformer l'objet en excluant les clés marquées
      const modifiedGameData = plainToInstance(IGameDTO, findOneGameData, {
        excludeExtraneousValues: true,
      });

      client.emit('joining-response', modifiedGameData);
    } catch (error) {
      // Gérer l'erreur, par exemple en journalisant ou en envoyant une réponse d'erreur
      console.error('Error handling joining logic:', error);
      const responseData: IWSResponseDTO = {
        status: 'error',
        error: 'Internal server error',
        message: 'An error occurred while processing your request.',
      };
      client.emit('joining-response', responseData);
      throw new WsException('An error occurred while processing your request.');
    }
  }
}
