import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GamesService } from './games.service';
import { GameSchema } from './schemas/game.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Game', schema: GameSchema }])],
  providers: [GamesService],
  exports: [GamesService],
})
export class GamesModule {}
