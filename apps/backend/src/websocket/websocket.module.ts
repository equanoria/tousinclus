import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { GameModule } from 'src/game/game.module';
import { WebsocketExceptionFilter } from '../utils/filters/websocket-exception.filter';
import { WebsocketGateway } from './websocket.gateway';

import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/redis/redis.service';
// ========== Service Import ==========
import { DebateService } from './service/debate.service';
import { DisconnectService } from './service/disconnect.service';
import { JoiningService } from './service/joining.service';
import { ReflectionService } from './service/reflection.service';
import { ResultService } from './service/result.service';
import { WaitingService } from './service/waiting.service';
import { RedisService } from 'src/redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { WebsocketService } from './websocket.service';
import { NotificationController } from './notification.controller';

@Module({
  imports: [GameModule, ScheduleModule.forRoot()],
  controllers: [NotificationController],
  providers: [
    NotificationController,
    WebsocketService,
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
