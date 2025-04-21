import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { SchedulerRegistry } from '@nestjs/schedule';
import { setTimeout } from 'node:timers';

// ========== Service Import ==========
import { GameService } from '../../game/game.service';

// ========== DTO Import ==========
import { WSControllerDTO, WSDataDTO, WSGameStatus } from '../dto/websocket.dto';
import { ErrorCode, WSResponseDTO } from 'src/utils/dto/response.dto';
import { GameDTO } from 'src/game/dto/game.dto';
import { plainToInstance } from 'class-transformer';
import { EnumGameStatus } from '@tousinclus/types';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WaitingService {
  constructor(
    private readonly gameService: GameService,
    private schedulerRegistry: SchedulerRegistry,
  ) {} // Injection of GameService

  async handleWaitingLogic(
    server: Server,
    client: Socket,
    data: WSControllerDTO,
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

  async handleTeamConnection(
    server: Server,
    client: Socket,
    code: WSDataDTO['code'],
    team: WSDataDTO['team'],
    clientId: string,
  ): Promise<void> {
    try {
      if (!team) {
        throw new BadRequestException(
          `No team specified. Please provide either 'team1' or 'team2'.`,
        );
      }

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
            this.executeDebateLogic(server, code);
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
      let errorCode = ErrorCode.GENERIC_ERROR;

      if (error instanceof NotFoundException) {
        errorCode = ErrorCode.NOT_FOUND;
      } else if (error instanceof ForbiddenException) {
        errorCode = ErrorCode.FORBIDDEN;
      } else if (error instanceof BadRequestException) {
        errorCode = ErrorCode.BAD_REQUEST;
      }

      const responseData: WSResponseDTO = {
        status: 'error',
        errorCode: errorCode,
        message: error.message,
        responseChannel: 'joining-response',
      };
      throw new WsException(responseData);
    }
  }

  private executeDebateLogic(server: Server, code: string) {
    const responseData: WSGameStatus = { gameStatus: 'debate' };

    this.gameService.updateGameStatus(code, EnumGameStatus.Debate);

    console.log('Je suis en phase débat');

    server.to(code).emit('game-status', responseData);
  }
}
