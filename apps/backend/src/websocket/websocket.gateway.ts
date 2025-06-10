import { Logger, UseFilters, UseInterceptors } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  type OnGatewayConnection,
  type OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { RedisTtlInterceptor } from 'src/utils/interceptors/redis-ttl.interceptor';

import { Server, Socket } from 'socket.io';

import { WebsocketExceptionFilter } from 'src/utils/filters/websocket-exception.filter';
import { WebsocketValidationPipe } from 'src/utils/pipes/websocket-validation.pipe';
import { WSControllerDTO } from './dto/websocket.dto';
import { DebateService } from './service/debate.service';
import { DisconnectService } from './service/disconnect.service';
// ========== Service Import ==========
import { JoiningService } from './service/joining.service';
import { ReflectionService } from './service/reflection.service';
import { ResultService } from './service/result.service';
import { WaitingService } from './service/waiting.service';

// Init websocket
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  path: '/api',
  serveClient: false,
})
@UseFilters(new WebsocketExceptionFilter())
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WebsocketGateway.name);

  constructor(
    private readonly joiningService: JoiningService,
    private readonly waitingService: WaitingService,
    private readonly reflectionService: ReflectionService,
    private readonly debatService: DebateService,
    private readonly resultService: ResultService,
    private readonly disconnectService: DisconnectService,
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
  @SubscribeMessage('debate')
  async handleDebate(
    @MessageBody() data: WSControllerDTO,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    await this.debatService.handleDebateLogic(this.server, client, { ...data });
  }

  @UseInterceptors(RedisTtlInterceptor)
  @SubscribeMessage('result')
  async handleResult(
    @MessageBody() data: WSControllerDTO,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    await this.resultService.handleResultLogic(client, { ...data });
  }
}
