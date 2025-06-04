import { GameService } from '../../game/game.service';
import { Socket } from 'socket.io';
export declare class DisconnectService {
    private readonly gameService;
    constructor(gameService: GameService);
    handleDisconnectLogic(client: Socket): Promise<void>;
}
