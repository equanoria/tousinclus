import { SchedulerRegistry } from '@nestjs/schedule';
import { GameService } from '../../game/game.service';
import { Server, Socket } from 'socket.io';
import { WSControllerDTO, WSDataDTO } from '../dto/websocket.dto';
export declare class WaitingService {
    private readonly gameService;
    private schedulerRegistry;
    constructor(gameService: GameService, schedulerRegistry: SchedulerRegistry);
    handleWaitingLogic(server: Server, client: Socket, data: WSControllerDTO): Promise<void>;
    handleTeamConnection(server: Server, client: Socket, code: WSDataDTO['code'], team: WSDataDTO['team'], clientId: string): Promise<void>;
    private executeDebateLogic;
}
