import {
  ConnectedSocket,
  MessageBody,
  type OnGatewayConnection,
  type OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import type { DebateService } from './debate.service';
import type { DisconnectService } from './disconnect.service';
import type { ReflectionService } from './reflection.service';
import type { WaitingService } from './waiting.service';

// Init websocket
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  serveClient: false,
})
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly waitingService: WaitingService,
    private readonly reflectionService: ReflectionService,
    private readonly debatService: DebateService,
    private readonly disconnectService: DisconnectService,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    console.log(`Client connected ${client.id}`);
    // Exemple d'initialisation ou de logique pour un nouveau client
  }

  async handleDisconnect(client: Socket): Promise<void> {
    console.log(`Client disconnected ${client.id}`);
    // Search for client.id in the Redis DB and delete the value
    await this.disconnectService.handleDisconnectLogic(client);
  }

  @SubscribeMessage('waiting')
  async handleWaiting(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    await this.waitingService.handleWaitingLogic(this.server, client, data);
  }

  @SubscribeMessage('reflexion')
  async handleReflexion(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    await this.reflectionService.handleReflectionLogic(client, data);
  }

  @SubscribeMessage('debat')
  async handleDebat(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    await this.debatService.handleDebateLogic(client, data);
  }
}
