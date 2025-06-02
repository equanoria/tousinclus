import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GamesService } from './games.service';
import { GameSchema } from './schemas/game.schema';
import { GAME_MODEL } from './constants';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: GAME_MODEL, schema: GameSchema }]),
  ],
  providers: [GamesService],
  exports: [GamesService],
})
export class GamesModule {}
