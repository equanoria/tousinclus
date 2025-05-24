import { io } from 'socket.io-client';
import { isValidUrl } from '../../utils/isValidUrl';

const socketIoUrl = isValidUrl(window.env.SOCKET_IO_URL)
      ? window.env.SOCKET_IO_URL
      : 'http://127.0.0.1:3001';

const socketIo = io(socketIoUrl, {
  closeOnBeforeunload: true,
});

export const socketService = socketIo;