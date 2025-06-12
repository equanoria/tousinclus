import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from 'config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DirectusModule } from './directus/directus.module';
import { GameModule } from './game/game.module';
import { RedisModule } from './redis/redis.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['./.env.local', './.env.development'],
      load: [configuration],
    }),
    WebsocketModule,
    RedisModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: `mongodb://${configService.getOrThrow('MONGO_USERNAME')}:${configService.getOrThrow('MONGO_PASSWORD')}@${configService.getOrThrow('MONGO_HOSTNAME')}:${configService.getOrThrow('MONGO_PORT')}/${configService.getOrThrow('MONGO_DATABASE')}?authSource=admin`,
      }),
    }),
    GameModule,
    DirectusModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
