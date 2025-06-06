import {
  EDebateStatus,
  type ETeam,
  type IAnswer,
  type IDebateData,
} from '@tousinclus/types';
import type { ISocketResponse } from '../../types/ISocketResponse';
import { socketService } from '../socket/socket.service';
import { gameService } from './game.service';
import type { TWSResponseCallback } from './types/TWSResponseCallback';

class GameDebateService {
  private onNextVoteCallbacks: TWSResponseCallback<{
    answers: IAnswer[];
    nextCardId: number;
  }>[] = [];
  private onErrorCallbacks: ((error: 'consensus') => void)[] = [];

  constructor() {
    socketService.on('debate-response', this.onGetVoteResponseDo.bind(this));
  }

  getVote(): this {
    const { code } = gameService;
    socketService.emit('debate', {
      action: 'get-vote',
      code,
    });

    return this;
  }

  private onGetVoteResponseDo(payload: ISocketResponse<IDebateData>) {
    const { status, data } = payload;

    if (status === 'success') {
      for (const callback of this.onNextVoteCallbacks) {
        callback(payload as ISocketResponse<IDebateData>);
      }

      if(data.eventType === EDebateStatus.RETRY){
        for (const callback of this.onErrorCallbacks) {
            callback('consensus');
          }
      }
    }
  }

  onNextVote(
    callback: TWSResponseCallback<{ answers: IAnswer[]; nextCardId: number }>,
  ): this {
    this.onNextVoteCallbacks.push(callback);
    return this;
  }

  onError(callback: (error: 'consensus') => void): this {
    this.onErrorCallbacks.push(callback);
    return this;
  }

  updateVote(cardId: number, vote: ETeam): this {
    const { code, team } = gameService;
    socketService.emit('debate', {
      action: 'update-vote',
      code,
      data: {
        cardId,
        votes: [
          {
            team,
            vote,
          },
        ],
      },
    });

    return this;
  }
}

export const gameDebateService = new GameDebateService();
