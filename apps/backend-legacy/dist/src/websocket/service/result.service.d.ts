import { Socket } from 'socket.io';
import { GameService } from 'src/game/game.service';
import { WSControllerDTO, WSDataDTO } from '../dto/websocket.dto';
export declare class ResultService {
    private readonly gameService;
    constructor(gameService: GameService);
    handleResultLogic(client: Socket, data: WSControllerDTO): Promise<void>;
    private calculateScores;
    getResultGame(client: Socket, data: WSDataDTO): Promise<void>;
}
