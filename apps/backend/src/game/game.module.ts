import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { GameController } from './game.controller';
import { GameService } from './game.service';

@Module({
  imports: [RedisModule],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
