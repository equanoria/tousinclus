import { type OnGatewayConnection, type OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JoiningService } from './service/joining.service';
import { WaitingService } from './service/waiting.service';
import { ReflectionService } from './service/reflection.service';
import { DebateService } from './service/debate.service';
import { ResultService } from './service/result.service';
import { DisconnectService } from './service/disconnect.service';
import { WSControllerDTO } from './dto/websocket.dto';
export declare class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly joiningService;
    private readonly waitingService;
    private readonly reflectionService;
    private readonly debatService;
    private readonly resultService;
    private readonly disconnectService;
    server: Server;
    private readonly logger;
    constructor(joiningService: JoiningService, waitingService: WaitingService, reflectionService: ReflectionService, debatService: DebateService, resultService: ResultService, disconnectService: DisconnectService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    handleJoining(data: WSControllerDTO, client: Socket): Promise<void>;
    handleWaiting(data: WSControllerDTO, client: Socket): Promise<void>;
    handleReflection(data: WSControllerDTO, client: Socket): Promise<void>;
    handleDebate(data: WSControllerDTO, client: Socket): Promise<void>;
    handleResult(data: WSControllerDTO, client: Socket): Promise<void>;
}
