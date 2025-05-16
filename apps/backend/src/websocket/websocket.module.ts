import { Module } from '@nestjs/common';
import { GameModule } from 'src/game/game.module';
import { WebsocketGateway } from './websocket.gateway';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_FILTER } from '@nestjs/core';
import { WebsocketExceptionFilter } from '../utils/filters/websocket-exception.filter';

// ========== Service Import ==========
import { DebateService } from './service/debate.service';
import { DisconnectService } from './service/disconnect.service';
import { ReflectionService } from './service/reflection.service';
import { WaitingService } from './service/waiting.service';
import { JoiningService } from './service/joining.service';
import { ResultService } from './service/result.service';
import { RedisService } from 'src/redis/redis.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [GameModule, ScheduleModule.forRoot()],
  providers: [
    WebsocketGateway,
    WaitingService,
    ReflectionService,
    DebateService,
    ResultService,
    DisconnectService,
    JoiningService,
    RedisService,
    ConfigService,
    {
      provide: APP_FILTER,
      useClass: WebsocketExceptionFilter,
    },
  ],
})
export class WebsocketModule {}
