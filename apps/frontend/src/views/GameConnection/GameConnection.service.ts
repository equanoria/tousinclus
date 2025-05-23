import type { IGame, ETeam } from '@tousinclus/types';
import { SocketService } from '../../services/socket/socket.service';
import type { TWaitingResponseCallback } from '../../services/game/types/TWaitingResponseCallback';

export class GameConnectionService extends SocketService {
  joinGame(code: string, team: ETeam) {
    this.socket.emit('waiting', {
      action: 'handle-team',
      code,
      team,
    });
  }

  joining(code: string) {
    this.socket.emit('joining', {
      action: 'joining-game',
      code,
    });
  }

  onJoiningResponse(callback: (game: IGame) => void) {
    this.socket.on('joining-response', callback);
  }

  onWaitingResponse(callback: TWaitingResponseCallback) {
    this.socket.on('waiting-response', callback);
  }
}
