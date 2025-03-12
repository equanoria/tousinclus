import { io, Socket } from 'socket.io-client';

interface GameInfo {
  code: string;
  status: string;
  isTeam1Connected: boolean | null;
  isTeam2Connected: boolean | null;
}

export class SocketIoService {
  private static socket: Socket | null = null;

  // Connexion au serveur socket.io
  public static connect(): void {
    if (!this.socket) {
      this.socket = io('http://127.0.0.1:3001');
    }
  }

  public static onTeamConnectionUpdated(callback: (data: any) => void): void {
    this.socket?.on('team-connection-updated', callback);
  }

  public static onTeamConnectionError(callback: (data: any) => void): void {
    this.socket?.on('team-connection-error', callback);
  }

  public static onGameStatus(callback: (data: any) => void): void {
    this.socket?.on('game-status', callback);
  }

  public static joinGame(gameCode: string, team: string): void {
    if (!this.socket) {
      console.error('Socket non initialisé !');
      return;
    }

    this.socket.emit('waiting', {
      action: 'handle-team',
      gameCode,
      team,
    });
  }

  public static disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }
}
