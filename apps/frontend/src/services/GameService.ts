import { io, type Socket } from 'socket.io-client';
import { isValidUrl } from '../utils/isValidUrl';
import type { TTeam } from '@tousinclus/types';

export class GameService {
  private socket: Socket;

  constructor() {
    const socketIoUrl = isValidUrl(window.env.SOCKET_IO_URL)
      ? window.env.SOCKET_IO_URL
      : 'http://127.0.0.1:3001';

    this.socket = io(socketIoUrl);
  }

  disconnect() {
    this.socket.disconnect();
  }

  joinGame(code: string, team: TTeam): this {
    this.socket.emit('waiting', {
      action: 'handle-team',
      code,
      team,
    });

    return this;
  }
}


// import { io, type Socket } from 'socket.io-client';

// export class SocketIoService {
//   private  socket: Socket | null = null;

//   // Connexion au serveur socket.io
//   public connect(): void {
//     if (!this.socket) {
//       this.socket = io('http://127.0.0.1:3001');
//     }
//   }

//   public onTeamConnectionUpdated(callback: (data: any) => void): void {
//     this.socket?.on('team-connection-updated', callback);
//   }

//   public onTeamConnectionError(callback: (data: any) => void): void {
//     this.socket?.on('team-connection-error', callback);
//   }

//   public onGameStatus(callback: (data: any) => void): void {
//     this.socket?.on('game-status', callback);
//   }

//   public joinGame(gameCode: string, team: string): void {
//     if (!this.socket) {
//       console.error('Socket non initialisé !');
//       return;
//     }

//     this.socket.emit('waiting', {
//       action: 'handle-team',
//       gameCode,
//       team,
//     });
//   }

//   public static disconnect(): void {
//     this.socket?.disconnect();
//     this.socket = null;
//   }
// }
