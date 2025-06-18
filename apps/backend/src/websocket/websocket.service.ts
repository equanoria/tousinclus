import { Injectable } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';

@Injectable()
export class WebsocketService {
  constructor(private readonly websocketGateway: WebsocketGateway) {}
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  emitToAll(event: string, data: any) {
    this.websocketGateway.server.emit(event, data);
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  emitToRoom(room: string, event: string, data: any) {
    this.websocketGateway.server.to(room).emit(event, data);
  }
}
