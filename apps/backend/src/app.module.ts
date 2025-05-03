import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DirectusModule } from './directus/directus.module';
import { GameModule } from './game/game.module';
import { RedisModule } from './redis/redis.module';
import { UserModule } from './user/user.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['../../.env.local', '../../.env.dev'],
    }),
    WebsocketModule,
    RedisModule,
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGO_USERNAME || 'backend'}:${process.env.MONGO_PASSWORD || 'RwXHd8Dv9VmhDHBA6mYVqd3HuryQ3P'}@${process.env.MONGO_HOSTNAME || 'localhost'}:${process.env.MONGO_PORT || '3003'}/${process.env.MONGO_DATABASE || 'backend'}?authSource=admin`,
    ),
    GameModule,
    DirectusModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
