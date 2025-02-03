import { Module } from '@nestjs/common';
import { GameModule } from 'src/game/game.module';
import { DebateService } from './debate.service';
import { DisconnectService } from './disconnect.service';
import { ReflectionService } from './reflection.service';
import { WaitingService } from './waiting.service';
import { WebsocketGateway } from './websocket.gateway';

@Module({
  imports: [GameModule],
  providers: [
    WebsocketGateway,
    WaitingService,
    ReflectionService,
    DebateService,
    DisconnectService,
  ],
})
export class WebsocketModule {}
