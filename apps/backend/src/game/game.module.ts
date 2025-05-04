import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { DirectusModule } from 'src/directus/directus.module';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    RedisModule,
    DirectusModule,
    CacheModule.register(),
    JwtModule.register({}),
  ],
  controllers: [GameController],
  providers: [GameService, AuthService, AuthGuard],
  exports: [GameService],
})
export class GameModule {}
