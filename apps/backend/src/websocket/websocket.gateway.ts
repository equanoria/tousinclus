import {
  ConnectedSocket,
  MessageBody,
  type OnGatewayConnection,
  type OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DebateService } from './debate.service';
import { DisconnectService } from './disconnect.service';
import { ReflectionService } from './reflection.service';
import { WaitingService } from './waiting.service';

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
    // Example of initialization or logic for a new client
  }

  async handleDisconnect(client: Socket): Promise<void> {
    console.log(`Client disconnected ${client.id}`);
    // Search for client.id in the Redis DB and delete the value
    await this.disconnectService.handleDisconnectLogic(client);
  }

  @SubscribeMessage('waiting')
  async handleWaiting(
    // biome-ignore lint/suspicious/noExplicitAny: TODO any type
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    await this.waitingService.handleWaitingLogic(this.server, client, data);
  }

  @SubscribeMessage('reflexion')
  async handleReflexion(
    // biome-ignore lint/suspicious/noExplicitAny: TODO any type
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    await this.reflectionService.handleReflectionLogic(client, data);
  }

  @SubscribeMessage('debat')
  async handleDebat(
    // biome-ignore lint/suspicious/noExplicitAny: TODO any type
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    await this.debatService.handleDebateLogic(client, data);
  }
}
