import { GameService } from 'src/game/game.service';
import { Socket } from 'socket.io';
import { WSControllerDTO, WSDataDTO } from '../dto/websocket.dto';
export declare class JoiningService {
    private readonly gameService;
    constructor(gameService: GameService);
    handleJoiningLogic(client: Socket, data: WSControllerDTO): Promise<void>;
    handleJoiningGame(client: Socket, data: WSDataDTO): Promise<void>;
}
