import { GameService } from 'src/game/game.service';
import { Socket } from 'socket.io';
import { WSControllerDTO, WSDataDTO } from '../dto/websocket.dto';
export declare class ReflectionService {
    private readonly gameService;
    constructor(gameService: GameService);
    handleReflectionLogic(client: Socket, data: WSControllerDTO): Promise<void>;
    getAnswers(client: Socket, data: WSDataDTO): Promise<void>;
    updateAnswer(client: Socket, data: WSDataDTO): Promise<void>;
}
