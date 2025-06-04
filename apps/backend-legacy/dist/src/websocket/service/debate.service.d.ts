import { GameService } from 'src/game/game.service';
import { Server, Socket } from 'socket.io';
import { WSControllerDTO, WSDataDTO } from '../dto/websocket.dto';
export declare class DebateService {
    private readonly gameService;
    constructor(gameService: GameService);
    handleDebateLogic(server: Server, client: Socket, data: WSControllerDTO): Promise<void>;
    getVote(client: Socket, data: WSDataDTO): Promise<void>;
    updateVote(server: Server, client: Socket, data: WSDataDTO): Promise<void>;
}
