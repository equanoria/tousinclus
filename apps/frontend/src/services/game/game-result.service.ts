import { socketService } from "../socket/socket.service";
import { gameService } from "./game.service";
import type { TWSResponseCallback } from "./types/TWSResponseCallback";

class GameResultService {
    getResult(): this {
      const { code } = gameService;
      socketService.emit('result', {
        action: 'get-result',
        code,
      });
  
      return this;
    }

    onGetResultResponse(callback: TWSResponseCallback<unknown>): this {
      socketService.on('result-response', callback);
      return this;
    }

    restartGame(): this {
      const { code } = gameService;
      socketService.emit('result', {
        action: 'restart-game',
        code,
      });

      return this;
    }
}

export const gameResultService = new GameResultService();
