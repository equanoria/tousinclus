import { ETeam, type IGame } from '@tousinclus/types';
import type { ISocketResponse } from '../../types/ISocketResponse';
import { socketService } from '../socket/socket.service';
import type { TGameStatusCallback } from './types/TGameStatusCallback';
import type { TWSResponseCallback } from './types/TWSResponseCallback';

class GameService {
  private _code?: string;
  private _team?: ETeam;
  private _cardsGroupId?: number;

  private readyCallbacks: (() => void)[] = [];

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
    socketService.on('game-status', (payload) => {
      callback(payload);
      this.onReadyTrigger();
    });
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

  onJoiningResponse(callback: TWSResponseCallback<IGame>): this {
    socketService.on('joining-response', callback);
    return this;
  }

  onWaitingResponse(callback: TWSResponseCallback<IGame>): this {
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

      this.onReadyTrigger();
    }
  }

  private onReadyTrigger() {
    if (this._code && this._team && this._cardsGroupId) {
      for (const callback of this.readyCallbacks) {
        callback();
      }
    }
  }

  onReady(callback: () => void): this {
    this.readyCallbacks.push(callback);
    return this;
  }
}

export const gameService = new GameService();
