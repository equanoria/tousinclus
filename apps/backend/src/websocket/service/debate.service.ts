import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class DebateService {
  async handleDebateLogic(client: Socket, data: unknown): Promise<void> {
    console.log('Handling debate logic for client', data);

    // Example: business logic for "Debate"
    client.emit('debate-response', { result: 'Logic for Debate executed' });
  }
}
