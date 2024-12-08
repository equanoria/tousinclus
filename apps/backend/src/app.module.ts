import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './redis/redis.module';
import { GatewayModule } from './gateway/gateway.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [GatewayModule, RedisModule, GameModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
