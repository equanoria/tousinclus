import type { ETeam } from '@tousinclus/types';
import { socketService } from '../socket/socket.service';
import type { TGameStatusCallback } from './types/TGameStatusCallback';
import type { TWSResponseCallback } from './types/TWSResponseCallback';

export class GameService {
  onGameStatus(callback: TGameStatusCallback): this {
    socketService.on('game-status', callback);
    return this;
  }

  joinGame(code: string, team: ETeam): this {
    socketService.emit('waiting', {
      action: 'handle-team',
      code,
      team,
    });
    return this;
  }

  joining(code: string): this {
    socketService.emit('joining', {
      action: 'joining-game',
      code,
    });
    return this;
  }

  onJoiningResponse(callback: TWSResponseCallback): this {
    socketService.on('joining-response', callback);
    return this;
  }

  onWaitingResponse(callback: TWSResponseCallback): this {
    socketService.on('waiting-response', callback);
    return this;
  }
}

export const gameService = new GameService();
