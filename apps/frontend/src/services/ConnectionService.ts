import type { TTeam } from '@tousinclus/types';
import { gameService } from './GameService';

class ConnectionService {
  private socket = gameService.getSocket();

  joinGame({ code, team }: { code: string; team: TTeam }): void {
    this.socket.emit('waiting', {
      action: 'handle-team',
      code,
      team,
    });
  }

  joining(code: string): void {
    this.socket.emit('joining', {
      action: 'joining-game',
      code,
    });
  }

  onJoiningResponse(callback: (data: any) => void): void {
    this.socket.on('joining-response', callback);
  }

  waitingResponse(callback: (data: { status: 'success' | 'error'; message?: string }) => void): void {
    this.socket.on('waiting-response', callback);
  }
}

export const connectionService = new ConnectionService();
