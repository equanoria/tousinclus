import { Injectable } from '@nestjs/common';
import { GameService } from '../game/game.service';
import { Socket } from 'socket.io';

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
