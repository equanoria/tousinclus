import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { WaitingService } from './waiting.service';
import { ReflectionService } from './reflection.service';
import { DebateService } from './debate.service';

// Init websocket
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    private readonly waitingService: WaitingService,
    private readonly reflectionService: ReflectionService,
    private readonly debatService: DebateService,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    console.log(`Client connecté ${client.id}`);
    // Exemple d'initialisation ou de logique pour un nouveau client
  }

  async handleDisconnect(client: Socket): Promise<void> {
    console.log(`Client déconnecté ${client.id}`);
    // Exemple de nettoyage ou de gestion à la déconnexion
  }

  @SubscribeMessage('waiting')
  async handleWaiting(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    await this.waitingService.handleWaitingLogic(client, data);
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
