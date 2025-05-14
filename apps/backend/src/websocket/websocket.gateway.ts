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

// ========== Service Import ==========
import { JoiningService } from './service/joining.service';
import { WaitingService } from './service/waiting.service';
import { ReflectionService } from './service/reflection.service';
import { DebateService } from './service/debate.service';
import { DisconnectService } from './service/disconnect.service';
import { WSControllerDTO } from './dto/websocket.dto';
import { WebsocketValidationPipe } from 'src/utils/pipes/websocket-validation.pipe';
import { WebsocketExceptionFilter } from 'src/utils/filters/websocket-exception.filter';
import { Logger, UseFilters, UseInterceptors } from '@nestjs/common';
import { RedisTtlInterceptor } from 'src/utils/interceptors/redis-ttl.interceptors';

// Init websocket
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  serveClient: false,
})
@UseFilters(new WebsocketExceptionFilter())
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly joiningService: JoiningService,
    private readonly waitingService: WaitingService,
    private readonly reflectionService: ReflectionService,
    private readonly debatService: DebateService,
    private readonly disconnectService: DisconnectService,
    private readonly logger = new Logger(WebsocketGateway.name),
  ) {}

  // ? Handle Websocket connection
  async handleConnection(client: Socket): Promise<void> {
    this.logger.log(`Client connected ${client.id}`);
  }

  // ? Handle Websocket disconnect
  async handleDisconnect(client: Socket): Promise<void> {
    this.logger.log(`Client disconnected ${client.id}`);
    // Search for client.id in the Redis DB and delete the value
    await this.disconnectService.handleDisconnectLogic(client);
  }

  // ? Handle Client join a game
  @UseInterceptors(RedisTtlInterceptor)
  @SubscribeMessage('joining')
  async handleJoining(
    @MessageBody(new WebsocketValidationPipe('joining-response'))
    data: WSControllerDTO,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    await this.joiningService.handleJoiningLogic(client, { ...data });
  }

  // ? Handle Client choose a team
  @UseInterceptors(RedisTtlInterceptor)
  @SubscribeMessage('waiting')
  async handleWaiting(
    @MessageBody(new WebsocketValidationPipe('waiting-response'))
    data: WSControllerDTO,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    await this.waitingService.handleWaitingLogic(this.server, client, {
      ...data,
    });
  }

  @UseInterceptors(RedisTtlInterceptor)
  @SubscribeMessage('reflection')
  async handleReflection(
    @MessageBody(new WebsocketValidationPipe('reflection-response'))
    data: WSControllerDTO,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    await this.reflectionService.handleReflectionLogic(client, {
      ...data,
    });
  }

  @UseInterceptors(RedisTtlInterceptor)
  @SubscribeMessage('debat')
  async handleDebate(
    // biome-ignore lint/suspicious/noExplicitAny: TODO any type
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    await this.debatService.handleDebateLogic(client, { ...data });
  }
}
