import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GamesService } from './rooms.service';
import { RoomDocument, RoomSchema } from './schemas/room.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RoomDocument.name, schema: RoomSchema },
    ]),
  ],
  providers: [GamesService],
  exports: [GamesService],
})
export class GamesModule {}
