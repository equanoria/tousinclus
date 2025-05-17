/* eslint-disable @typescript-eslint/no-explicit-any */
import { io, type Socket } from 'socket.io-client';
import { isValidUrl } from '../utils/isValidUrl';
import type { EGameStatus, TTeam, IAnswerData } from '@tousinclus/types';



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

  requestGameStatus(callback: (data: { status: EGameStatus }) => void): void {
    this.socket.on('game-status', (data) => {
      callback({ status: data.gameStatus });
    });
  }

  getSocket(): Socket {
    return this.socket;
  }

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

  waitingResponse(
    callback: (data: { status: 'success' | 'error'; message?: string }) => void,
  ): void {
    this.socket.on('waiting-response', callback);
  }

  updateAnswer(code: string, data: IAnswerData): void {
    this.socket.emit('reflection', {
      action: 'update-answer',
      code,
      ...data,
    });
  }
}
