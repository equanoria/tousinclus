import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

// ========== Service Import ==========
import { GameService } from '../../game/game.service';

// ========== Interface Import ==========
import type { IWaitingData } from '../interfaces/data.interface';

@Injectable()
export class WaitingService {
  constructor(private readonly gameService: GameService) {} // Injection of GameService

  async handleWaitingLogic(
    server: Server,
    client: Socket,
    data: IWaitingData,
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
          data.gameCode,
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
    gameCode: string,
    team: string,
    clientId: string,
  ): Promise<void> {
    try {
      // Format the team field correctly
      const formattedTeam = team.toLowerCase().replace(/\s/g, '');

      // Call the service to update the connection status of a team
      const updatedGame = await this.gameService.updateTeamConnectionStatus(
        gameCode,
        formattedTeam,
        clientId,
      );

      // Register the game code and team in the Socket IO client
      client.data.team = formattedTeam;
      client.data.gameCode = gameCode;

      // Add the client to a SocketIO "room"
      client.join(gameCode);

      // Notify the client that the state has been updated
      client.emit('team-connection-updated', {
        status: 'success',
        gameCode,
        team,
        clientId,
      });

      console.log(`Updated game (Team Choice): ${JSON.stringify(updatedGame)}`);

      const isReadyToStart =
        await this.gameService.checkIfReadyToStart(gameCode);

      if (isReadyToStart) {
        // Send a message to all participants in the room
        server
          .to(gameCode)
          .emit('game-status', { gameStatus: 'start', gameCode });

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

      // Send a structured error response to the client
      client.emit('team-connection-error', {
        status: 'error',
        errorCode,
        message: error.message,
      });
    }
  }
}
