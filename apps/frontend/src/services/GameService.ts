/* eslint-disable @typescript-eslint/no-explicit-any */
import { io, type Socket } from 'socket.io-client';
import { isValidUrl } from '../utils/isValidUrl';
import type { TTeam, IAnswerData, ETeam } from '@tousinclus/types';

interface ReflectionPayload {
  code: string;
  team: ETeam;
  cardId: number;
  answer: IAnswerData;
}

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
      action: 'joining-game',
      code: code,
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
      code,
      team,
    });
    return this;
  }

  waitingResponse(callback: (data: { status: 'success' | 'error'; message?: string }) => void): void {
    this.socket.on('waiting-response', callback);
  }

  sendReflection(data: ReflectionPayload): void {
    this.socket.emit('reflection', {
      action: 'update-answer',
      ...data,
    });
  }

  onReflectionResponse(callback: (data: { status: string; message?: string; data?: IAnswerData }) => void): void {
    this.socket.on('reflection-response', callback);
  }
}
