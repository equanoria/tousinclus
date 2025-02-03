import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import { RedisModule } from './redis/redis.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [WebsocketModule, RedisModule, GameModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
