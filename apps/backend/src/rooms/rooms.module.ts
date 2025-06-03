import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomDocument, RoomSchema } from './schemas/room.schema';
import { AbilitiesModule } from 'src/auth/abilities/abilities.module';
import { defineRoomAbilities } from './rooms.ability';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { AuthModule } from 'src/auth/auth.module';
import { DirectusModule } from 'src/directus/directus.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RoomDocument.name, schema: RoomSchema },
    ]),
    DirectusModule,
    AuthModule,
    AbilitiesModule.forFeature(defineRoomAbilities),
  ],
  providers: [RoomsService],
  exports: [RoomsService],
  controllers: [RoomsController],
})
export class RoomsModule {}
