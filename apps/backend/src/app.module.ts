import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './redis/redis.module';
import { WebsocketModule } from './websocket/websocket.module';
import { GameModule } from './game/game.module';
import { DirectusModule } from './directus/directus.module';

@Module({
  imports: [WebsocketModule, RedisModule, GameModule, DirectusModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
