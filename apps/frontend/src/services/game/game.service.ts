import { SocketService } from '../socket/socket.service';
import type { TGameStatusCallback } from './types/TGameStatusCallback';
import type { TWaitingResponseCallback } from './types/TWaitingResponseCallback';

export class GameService extends SocketService {
  onGameStatus(callback: TGameStatusCallback) {
    this.socket.on('game-status', callback);
  }

  onWaitingResponse(callback: TWaitingResponseCallback) {
    this.socket.on('waiting-response', callback);
  }
}
