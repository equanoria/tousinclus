import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

// ========== Service Import ==========
import { GameService } from 'src/game/game.service';

// ========== Interface Import ==========
import type { IGameData } from '../interfaces/data.interface';

@Injectable()
export class JoiningService {

    constructor(private readonly gameService: GameService) { } // Injection of GameService

    async handleJoiningLogic(client: Socket, data: IGameData): Promise<void> {
        console.log('Handling joining logic for client', data);

        // Call the service to update the connection status of a team
        const findOneGameData = await this.gameService.findOneGame(data.gameCode);

        // Example: business logic for "Debate"
        client.emit('joining-response', findOneGameData);
    }
}
