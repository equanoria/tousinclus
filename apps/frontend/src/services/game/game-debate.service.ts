import { socketService } from '../socket/socket.service';
import { gameService } from './game.service';

class GameDebateService {
  getVote(): this {
    const { code } = gameService;
    socketService.emit('debate', {
      action: 'get-vote',
      code
    });

    return this;
  }

  onGetVoteResponse(callback: (payload: unknown) => void): this {
    socketService.on('debate-response', callback);
    return this;
  }
}

export const gameDebateService = new GameDebateService();
