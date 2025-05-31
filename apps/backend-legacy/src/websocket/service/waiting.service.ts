import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { setTimeout } from 'node:timers';

// ========== Service Import ==========
import { GameService } from '../../game/game.service';
import { WsException } from '@nestjs/websockets';

// ========== WebSocket Import ==========
import { Server, Socket } from 'socket.io';

// ========== DTO Import ==========
import { WSControllerDTO, WSDataDTO, WSGameStatus } from '../dto/websocket.dto';
import { ErrorCode, WSResponseDTO } from 'src/utils/dto/response.dto';
import { GameDTO } from 'src/game/dto/game.dto';
import { plainToInstance } from 'class-transformer';
import { EGameStatus } from '@tousinclus/types';

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
        groups: ['room', client.data.team],
      });

      // Notify the client that the state has been updated
      client.emit('waiting-response', {
        status: 'success',
        message: `You successfully join ${formattedTeam}`,
        data: dataGame,
      });

      // Vérifie que la partie n'a pas déjà commencé
      if (dataGame.status === EGameStatus.WAITING) {
        const isReadyToStart = await this.gameService.checkIfReadyToStart(code);

        if (isReadyToStart) {
          const responseData: WSGameStatus = {
            gameStatus: EGameStatus.REFLECTION,
            timeStamp: new Date(),
          };

          // Update game status to reflection
          await this.gameService.updateGameStatus(code, EGameStatus.REFLECTION);

          // Convert reflectionDuration from minutes to milliseconds
          const reflectionDuration = dataGame.reflectionDuration * 60 * 1000;

          // Set reflectionEndsAt
          const reflectionEndTime = new Date(Date.now() + reflectionDuration);
          await this.gameService.updateReflectionEndsAt(
            code,
            reflectionEndTime,
          );

          // Set the end of reflection phase
          const timeout = setTimeout(() => {
            this.executeDebateLogic(server, code);
          }, reflectionDuration);
          this.schedulerRegistry.addTimeout(
            `reflection-${dataGame.code}`,
            timeout,
          );

          // Send a message to all participants in the room
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
        responseChannel: 'waiting-response',
      };
      throw new WsException(responseData);
    }
  }

  private executeDebateLogic(server: Server, code: string) {
    const responseData: WSGameStatus = { gameStatus: EGameStatus.DEBATE };

    this.gameService.updateGameStatus(code, EGameStatus.DEBATE);

    console.log('Je suis en phase débat');

    server.to(code).emit('game-status', responseData);
  }
}
