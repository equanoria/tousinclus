import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { SchedulerRegistry } from '@nestjs/schedule';
import { setTimeout } from 'node:timers';

// ========== Service Import ==========
import { GameService } from '../../game/game.service';

// ========== DTO Import ==========
import { WSDataDTO, WSGameStatus } from '../dto/websocket.dto';
import { WSResponseDTO } from 'src/utils/dto/response.dto';
import { GameDTO } from 'src/game/dto/game.dto';
import { plainToInstance } from 'class-transformer';
import { EnumGameStatus } from '@tousinclus/types';

@Injectable()
export class WaitingService {
  constructor(
    private readonly gameService: GameService,
    private schedulerRegistry: SchedulerRegistry,
  ) {} // Injection of GameService

  async handleWaitingLogic(
    server: Server,
    client: Socket,
    data: WSDataDTO,
  ): Promise<void> {
    // Checking the action
    const { action, ...CData } = data;

    // Trigger the appropriate logic based on the action
    switch (action) {
      case 'handle-team':
        // Call the method to handle team connection
        await this.handleTeamConnection(
          server,
          client,
          CData.code,
          CData.team,
          client.id,
        );
        break;

      default:
        // Emit an error in case of unrecognized action
        client.emit('waiting-response', {
          status: 'error',
          message: 'Action non reconnue',
          action,
        });
    }
  }

  async handleTeamConnection(
    server: Server,
    client: Socket,
    code: WSDataDTO['code'],
    team: WSDataDTO['team'],
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
      const dataGame = plainToInstance(GameDTO, updatedGame, {
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

      // Vérifie que la partie n'a pas déjà commencé
      if (dataGame.status === EnumGameStatus.Waiting) {
        const isReadyToStart = await this.gameService.checkIfReadyToStart(code);

        if (isReadyToStart) {
          const responseData: WSGameStatus = { gameStatus: 'reflection' };
          // Send a message to all participants in the room
          this.gameService.updateGameStatus(code, EnumGameStatus.Reflection);

          // Convert reflectionDuration from minutes to milliseconds
          const reflectionDuration = dataGame.reflectionDuration * 60 * 1000;

          const timeout = setTimeout(() => {
            this.executeReflectionLogic(server, code);
          }, reflectionDuration);

          this.schedulerRegistry.addTimeout(
            `reflection-${dataGame.code}`,
            timeout,
          );

          console.log(
            `Dans ${dataGame.reflectionDuration} min je vais passer en phase débat`,
          );

          server.to(code).emit('game-status', responseData);
        }
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

      const responseData: WSResponseDTO = {
        status: 'error',
        message: error.message,
        error: errorCode,
      };
      // Send a structured error response to the client
      client.emit('team-connection-error', responseData);
    }
  }

  private executeReflectionLogic(server: Server, code: string) {
    const responseData: WSGameStatus = { gameStatus: 'debate' };

    this.gameService.updateGameStatus(code, EnumGameStatus.Debate);

    console.log('Je suis en phase débat');

    server.to(code).emit('game-status', responseData);
  }
}
