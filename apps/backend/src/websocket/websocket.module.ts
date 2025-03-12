import { Module } from '@nestjs/common';
import { GameModule } from 'src/game/game.module';
import { WebsocketGateway } from './websocket.gateway';

// ========== Service Import ==========
import { DebateService } from './service/debate.service';
import { DisconnectService } from './service/disconnect.service';
import { ReflectionService } from './service/reflection.service';
import { WaitingService } from './service/waiting.service';
import { JoiningService } from './service/joining.service';

@Module({
  imports: [GameModule],
  providers: [
    WebsocketGateway,
    WaitingService,
    ReflectionService,
    DebateService,
    DisconnectService,
    JoiningService,
  ],
})
export class WebsocketModule {}
