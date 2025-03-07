import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

// ========== Service Import ==========
import { GameService } from '../../game/game.service';

// ========== DTO Import ==========
import { IWaitingDataDTO, IWSGameStatus } from '../dto/websocket.dto';
import { IWSResponseDTO } from 'src/utils/dto/response.dto';
import { IGameDTO } from 'src/game/dto/game.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class WaitingService {
  constructor(private readonly gameService: GameService) {} // Injection of GameService

  async handleWaitingLogic(
    server: Server,
    client: Socket,
    data: IWaitingDataDTO,
  ): Promise<void> {
    // Checking the action
    const action = data?.action;

    // Trigger the appropriate logic based on the action
    switch (action) {
      case 'handle-team':
        // Call the method to handle team connection
        await this.handleTeamConnection(
          server,
          client,
          data.code,
          data.team,
          client.id,
        );
        break;

      default:
        // Emit an error in case of unrecognized action
        client.emit('error', { message: 'Action non reconnue', action });
    }
  }

  async handleTeamConnection(
    server: Server,
    client: Socket,
    code: IWaitingDataDTO['code'],
    team: IWaitingDataDTO['team'],
    clientId: string,
  ): Promise<void> {
    try {
      // Format the team field correctly
      const formattedTeam = team.toLowerCase().replace(/\s/g, '');

      // Call the service to update the connection status of a team
      const updatedGame = await this.gameService.updateTeamConnectionStatus(
        code,
        formattedTeam,
        clientId,
      );

      // Register the game code and team in the Socket IO client
      client.data.team = formattedTeam;
      client.data.code = code;

      // Add the client to a SocketIO "room"
      client.join(code);

      // Transformer l'objet en excluant les clés marquées
      const dataGame = plainToInstance(IGameDTO, updatedGame, {
        excludeExtraneousValues: true,
        groups: ['room'],
      });

      // Notify the client that the state has been updated
      client.emit('waiting-response', {
        status: 'success',
        message: `You successfully join ${formattedTeam}`,
        data: dataGame,
      });

      console.log(`Updated game (Team Choice): ${JSON.stringify(updatedGame)}`);

      const isReadyToStart = await this.gameService.checkIfReadyToStart(code);

      if (isReadyToStart) {
        const responseData: IWSGameStatus = { gameStatus: 'start', code };
        // Send a message to all participants in the room
        server.to(code).emit('game-status', responseData);

        // TODO: Move the status to the next status
      }
    } catch (error) {
      console.error(`Error updating team connection: ${error.message}`);

      // Handle specific cases
      let errorCode = 'GENERIC_ERROR';
      if (error.message.includes('not found')) {
        errorCode = 'GAME_NOT_FOUND';
      } else if (error.message.includes('already connected')) {
        errorCode = 'TEAM_ALREADY_ASSIGNED';
      }

      const responseData: IWSResponseDTO = {
        status: 'error',
        message: error.message,
        error: errorCode,
      };
      // Send a structured error response to the client
      client.emit('team-connection-error', responseData);
    }
  }
}
