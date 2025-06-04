// ========== Commons Import ==========
import { Logger } from '@nestjs/common';

// ========== Types Import ==========
import { RoomDto } from './dto/room.dto';

// ========== Service Import ==========
import { RoomsService } from './rooms.service';

// ========== Websocket Import ==========
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
import { plainToInstance } from 'class-transformer';

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
    // Transformer l'objet en excluant les clés marquées
    const modifiedGameData = plainToInstance(
      RoomDto,
      this.roomsService.getByCode(code),
      {
        excludeExtraneousValues: true,
        groups: ['player'],
      },
    );

    return modifiedGameData;
  }
}
