import type { IAnswer, IAnswerData, IGame } from '@tousinclus/types';
import { socketService } from '../socket/socket.service';
import { gameService } from './game.service';
import type { TWSResponseCallback } from './types/TWSResponseCallback';
import type { ISocketResponse } from '../../types/ISocketResponse';

class GameReflectionService {
  private _answers?: IAnswer[];

  private getAnswersCallbacks: TWSResponseCallback<IGame>[] = [];
  private updateAnswerCallbacks: TWSResponseCallback<IAnswer>[] = [];

  constructor() {
    gameService.onReady(() => {
      this.getAnswers();
    });
    socketService.on('reflection-response', this.onReflectionResponseDo.bind(this));
  }

  private get answers() {
    if (!this._answers) throw new Error('Undefined answers');
    return this._answers;
  }

  private getAnswers() {
    const { code, team } = gameService;
    socketService.emit('reflection', {
      action: 'get-answers',
      code,
      team,
    });
  }

  onGetAnswersResponse(callback: TWSResponseCallback<IGame>): this {
    this.getAnswersCallbacks.push(callback);
    return this;
  }

  private setAnswer(answer: IAnswer) {
    this._answers = this.answers.filter((ansr) => ansr.cardId !== answer.cardId);
    this._answers.push(answer);
  }

  updateAnswer(cardId: number, answer: IAnswerData) {
    const { code, team } = gameService;
    const data = { cardId, team, answer };

    socketService.emit('reflection', {
      action: 'update-answer',
      code,
      data,
    });
  }

  onUpdateAnswerResponse(callback: TWSResponseCallback<IAnswer>): this {
    this.updateAnswerCallbacks.push(callback);
    return this;
  }

  private onReflectionResponseDo(payload: ISocketResponse<IGame | IAnswer>) {
    const { status, data } = payload;

     if (status === 'success') {
      if ('answers' in data) {
        const gameData = data as IGame; // TODO: Plus jamais ça
        this._answers = gameData.answers;

        for (const callback of this.getAnswersCallbacks) {
          callback(payload as ISocketResponse<IGame>);
        }
      }

      if ('answer' in data) {
        const answerData = data as IAnswer; // TODO: ...vraiment, jamais
        this.setAnswer(answerData);

        for (const callback of this.updateAnswerCallbacks) {
          callback(payload as ISocketResponse<IAnswer>);
        }
      }
     }
  }

  getAnswer(cardId: number) {
    return this.answers.find((answer) => answer.cardId === cardId);
  }
}

export const gameReflectionService = new GameReflectionService();
