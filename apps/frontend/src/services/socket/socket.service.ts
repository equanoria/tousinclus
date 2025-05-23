import { io, type Socket } from 'socket.io-client';
import { isValidUrl } from '../../utils/isValidUrl';

export class SocketService {
  protected socket: Socket;

  constructor() {
    const socketIoUrl = isValidUrl(window.env.SOCKET_IO_URL)
      ? window.env.SOCKET_IO_URL
      : 'http://127.0.0.1:3001';

    this.socket = io(socketIoUrl, {
      closeOnBeforeunload: true,
    });
  }

  protected disconnect() {
    this.socket.disconnect();
  }
}