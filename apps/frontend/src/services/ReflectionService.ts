import type { IAnswerData, ETeam } from '@tousinclus/types';
import { gameService } from './GameService';

interface ReflectionPayload {
  code: string;
  team: ETeam;
  cardId: number;
  answer: IAnswerData;
}

class ReflectionService {
  private socket = gameService.getSocket();

  sendReflection(data: ReflectionPayload): void {
    this.socket.emit('reflection', {
      action: 'update-answer',
      ...data,
    });
  }

  onReflectionResponse(
    callback: (data: {
      status: string;
      message?: string;
      data?: IAnswerData;
    }) => void,
  ): void {
    this.socket.on('reflection-response', callback);
  }
}

export const reflectionService = new ReflectionService();
