/* eslint-disable @typescript-eslint/no-explicit-any */
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

  joining(code: string): this {
    this.socket.emit('joining', {
      gameCode: code,
    });

    return this;
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  onJoiningResponse(callback: (data: any) => void): void {
    this.socket.on('joining-response', callback);
  }

  joinGame({ code, team }: { code: string; team: TTeam }): this {
    this.socket.emit('waiting', {
      action: 'handle-team',
      gameCode: code,
      team,
    });

    return this;
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  onTeamConnectionUpdated(callback: (data: any) => void): void {
    this.socket.on('team-connection-updated', callback);
  }
}
