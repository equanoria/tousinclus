import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class ReflectionService {
    async handleReflectionLogic(client: Socket, data: any): Promise<void> {
        console.log(`Handling reflection logic for client`, data);

        // Exemple : logique métier pour "Réflection"
        client.emit('reflection-response', { result: 'Logic for Reflection executed' });
    }
}