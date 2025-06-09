import { io } from 'socket.io-client';
import { urlValidator } from '../../utils/urlValidator';

const socketIoUrl = urlValidator(
  window.env.SOCKET_IO_URL,
  'http://127.0.0.1:3001',
);

const socketIo = io(socketIoUrl.toString(), {
  closeOnBeforeunload: true,
});

export const socketService = socketIo;
