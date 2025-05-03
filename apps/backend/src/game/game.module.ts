import { Module } from '@nestjs/common';
import { DirectusModule } from 'src/directus/directus.module';
import { RedisModule } from '../redis/redis.module';
import { GameController } from './game.controller';
import { GameService } from './game.service';

@Module({
  imports: [RedisModule, DirectusModule],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
