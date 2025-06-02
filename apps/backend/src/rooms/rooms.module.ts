import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomDocument, RoomSchema } from './schemas/room.schema';
import { AbilitiesModule } from 'src/auth/abilities/abilities.module';
import { defineRoomAbilities } from './rooms.ability';
import { RoomsService } from './rooms.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RoomDocument.name, schema: RoomSchema },
    ]),
    AbilitiesModule.forFeature(defineRoomAbilities),
  ],
  providers: [RoomsService],
  exports: [RoomsService],
})
export class GamesModule {}
