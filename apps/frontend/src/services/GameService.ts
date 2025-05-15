/* eslint-disable @typescript-eslint/no-explicit-any */
import { io, type Socket } from 'socket.io-client';
import { isValidUrl } from '../utils/isValidUrl';
import type { EGameStatus } from '@tousinclus/types';

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

  gameStatus(callback: (data: { status?: EGameStatus }) => void): void {
    this.socket.on('game-status', callback);
  }

  getSocket(): Socket {
    return this.socket;
  }
}

