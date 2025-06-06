import type { ETeam, IAnswer } from '@tousinclus/types';
import type { ISocketResponse } from '../../types/ISocketResponse';
import { socketService } from '../socket/socket.service';
import { gameService } from './game.service';
import type { TWSResponseCallback } from './types/TWSResponseCallback';

class GameDebateService {
  private onNextVoteCallbacks: TWSResponseCallback<{ answers: IAnswer[], nextCardId: { nextCardId: number }}>[] = [];

  constructor() {
    socketService.on('debate-response', this.onGetVoteResponseDo.bind(this));
  }

  getVote(): this {
    const { code } = gameService;
    socketService.emit('debate', {
      action: 'get-vote',
      code
    });

    return this;
  }

  private onGetVoteResponseDo(payload: ISocketResponse<{ answers: IAnswer[], nextCardId: { nextCardId: number }} | IAnswer  | { nextCardId: number }>) {
    const { status, data } = payload;
    console.log(payload)

    if (status === 'success') {
      if ('answers' in data) {
        for (const callback of this.onNextVoteCallbacks) {
          callback(payload as ISocketResponse<{ answers: IAnswer[], nextCardId: { nextCardId: number }}>);
        }
      }

      if ('nextCardId' in data && typeof data.nextCardId === 'number') {
        this.getVote();
      }
    }
  }

  onNextVote(callback: TWSResponseCallback<{ answers: IAnswer[], nextCardId: { nextCardId: number }}>): this {
    this.onNextVoteCallbacks.push(callback);
    return this;
  }

  updateVote(cardId: number, vote: ETeam): this {
    const { code, team } = gameService;
    socketService.emit('debate', {
      action: 'update-vote',
      code,
      data: {
        cardId,
        votes: [{
          team,
          vote,
        }],
      },
    });

    return this;
  }
}

export const gameDebateService = new GameDebateService();
