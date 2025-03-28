import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@Injectable()
export class ReflectionService {
  async handleReflectionLogic(
    server: Server,
    client: Socket,
    data: any,
  ): Promise<void> {
    const { action, ...CData } = data;

    switch (action) {
      case 'get-answer':
        // Call the method to get sheet
        console.log(CData);
        break;

      case 'update-answer':
        // Call the method to get sheet
        console.log(CData);
        break;

      default:
        // Emit an error in case of unrecognized action
        client.emit('error', { message: 'Action non reconnue', action });
    }

    // Example: business logic for "Reflection"
    client.emit('reflection-response', {
      result: 'Logic for Reflection executed',
    });
  }

  async updateSheet() {}
}
