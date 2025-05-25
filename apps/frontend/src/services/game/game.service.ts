import { ETeam, type IGame } from '@tousinclus/types';
import { socketService } from '../socket/socket.service';
import type { TGameStatusCallback } from './types/TGameStatusCallback';
import type { TWSResponseCallback } from './types/TWSResponseCallback';
import type { ISocketResponse } from '../../types/ISocketResponse';

class GameService {
  private _code?: string;
  private _team?: ETeam;
  private _cardsGroupId?: number;

  get code() {
    if (!this._code) throw new Error('Undefined game code');
    return this._code;
  }

  get team() {
    if (!this._team) throw new Error('Undefined game team');
    return this._team;
  }

  get cardsGroupId() {
    if (!this._cardsGroupId) throw new Error('Undefined card group');
    return this._cardsGroupId;
  }

  onGameStatus(callback: TGameStatusCallback): this {
    socketService.on('game-status', callback);
    return this;
  }

  joinGame(code: string, team: ETeam): this {
    socketService.emit('waiting', {
      action: 'handle-team',
      code,
      team,
    });
    return this;
  }

  joining(code: string): this {
    socketService.emit('joining', {
      action: 'joining-game',
      code,
    });
    return this;
  }

  onJoiningResponse(callback: TWSResponseCallback): this {
    socketService.on('joining-response', callback);
    return this;
  }

  onWaitingResponse(callback: TWSResponseCallback): this {
    socketService.on('waiting-response', (payload) => {
      this.onWaitingResponseDo(payload);
      callback(payload);
    });
    return this;
  }

  private async onWaitingResponseDo(payload: ISocketResponse<IGame>) {
    const { status, data } = payload;

    if (status === 'success') {
      if ('team1' in data) {
        this._team = ETeam.TEAM1;
      } else if ('team2' in data) {
        this._team = ETeam.TEAM2;
      } // TODO: j'ai mal aux yeux, à refacto absolument

      this._code = data.code;
      this._cardsGroupId = data.cardGroupId;
    }
  }
}

export const gameService = new GameService();
