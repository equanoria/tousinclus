import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { RedisModule } from '../redis/redis.module';
import { WaitingService } from 'src/websocket/waiting.service';

@Module({
  imports: [RedisModule],
  controllers: [GameController],
  providers: [GameService, WaitingService],
  exports: [GameService],
})
export class GameModule {}
