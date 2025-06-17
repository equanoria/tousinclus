import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { DirectusModule } from 'src/directus/directus.module';
import { RedisModule } from '../redis/redis.module';
import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { RolesGuard } from './auth/roles.guard';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameSchema } from './schema/game.schema';

@Module({
  imports: [
    AuthModule,
    RedisModule,
    MongooseModule.forFeature([{ name: 'Game', schema: GameSchema }]),
    DirectusModule,
    CacheModule.register(),
    JwtModule.register({}),
  ],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
