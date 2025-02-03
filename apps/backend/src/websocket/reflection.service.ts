import { Injectable } from '@nestjs/common';
import type { Socket } from 'socket.io';

@Injectable()
export class ReflectionService {
  async handleReflectionLogic(client: Socket, data: unknown): Promise<void> {
    console.log('Handling reflection logic for client', data);

    // Exemple : logique métier pour "Réflection"
    client.emit('reflection-response', {
      result: 'Logic for Reflection executed',
    });
  }
}
