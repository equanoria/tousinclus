/**
 * Commons Import
 */
import { Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

/**
 * Types Import
 */
import { RoomDto } from './dto/room.dto';
import { EGroupExpose } from 'src/utils/types/Groups';

/**
 * Service Import
 */
import { RoomsService } from './rooms.service';

/**
 * Websocket Import
 */
import { Server, Socket } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  serveClient: false,
})
export class RoomsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(RoomsGateway.name);

  constructor(private readonly roomsService: RoomsService) {}

  // ? Handle Websocket connection
  handleConnection(client: Socket): void {
    this.logger.log(`Client connected ${client.id}`);
  }

  // ? Handle Websocket disconnect
  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected ${client.id}`);
  }

  @SubscribeMessage('room:find')
  async handleFindOneRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody('code') code: string,
  ): Promise<RoomDto> {
    // Transform the object by excluding the marked keys
    const modifiedGameData = plainToInstance(
      RoomDto,
      this.roomsService.getByCode(code),
      {
        excludeExtraneousValues: true,
        groups: [EGroupExpose.PLAYER],
      },
    );

    return modifiedGameData;
  }
}
