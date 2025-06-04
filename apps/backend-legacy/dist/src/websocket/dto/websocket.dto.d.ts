import { IWSData, IWSGameStatus, IWSController, EGameStatus } from '@tousinclus/types';
import { AnswerDTO, VoteDTO } from '../../game/dto/game.dto';
export declare class WSDataDTO implements IWSData {
    code: string;
    team?: string;
    data?: AnswerDTO | VoteDTO;
}
export declare class WSControllerDTO extends WSDataDTO implements IWSController {
    action: string;
}
export declare class WSGameStatus implements IWSGameStatus {
    gameStatus: EGameStatus;
    timeStamp?: Date;
}
