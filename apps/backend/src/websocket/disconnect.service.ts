import { Injectable } from '@nestjs/common';
import type { Socket } from 'socket.io';
import type { GameService } from '../game/game.service';

@Injectable()
export class DisconnectService {
  constructor(private readonly gameService: GameService) {} // Injection du GameService

  async handleDisconnectLogic(client: Socket): Promise<void> {
    try {
      const updatedGame = await this.gameService.updateTeamDisconnectStatus(
        client.data.gameCode,
        client.data.team,
        client.id,
      );
      console.log(
        `Updated game (Disconnected): ${JSON.stringify(updatedGame)}`,
      );
    } catch (error) {
      console.error(`Error Delete client ID game: ${error.message}`);
    }
  }
}
