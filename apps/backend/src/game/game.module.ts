import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { DirectusModule } from 'src/directus/directus.module';

@Module({
  imports: [RedisModule, DirectusModule],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
