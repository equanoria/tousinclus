import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { WaitingService } from './waiting.service';
import { ReflectionService } from './reflection.service';
import { DebateService } from './debate.service';
import { DisconnectService } from './disconnect.service';
import { GameModule } from 'src/game/game.module';

@Module({
  imports: [GameModule],
  providers: [WebsocketGateway, WaitingService, ReflectionService, DebateService, DisconnectService],
})
export class WebsocketModule {}
