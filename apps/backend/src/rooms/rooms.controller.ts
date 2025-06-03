import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Abilities } from 'src/auth/abilities/abilities.decorator';
import { AbilitiesGuard } from 'src/auth/abilities/abilities.guard';
import { EAction } from 'src/auth/abilities/types/Action';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoomDocument } from './schemas/room.schema';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomDto } from './dto/room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { User } from 'src/utils/decorators/user.decorator';
import { UserDto } from 'src/users/dto/user.dto';
import { Types } from 'mongoose';
import { MongoIdPipe } from 'src/pipes/mongo-id/mongo-id.pipe';
import { plainToInstance } from 'class-transformer';

@UseGuards(AuthGuard, AbilitiesGuard)
@Abilities((ability) => ability.can(EAction.MANAGE, RoomDocument))
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get(':id')
  async getOne(@Param('id', MongoIdPipe) id: Types.ObjectId): Promise<RoomDto> {
    const room = await this.roomsService.getOne(id);
    return plainToInstance(RoomDto, room.toObject());
  }

  @Put()
  async createOne(
    @Body() createRoomDto: CreateRoomDto,
    @User() user: UserDto,
  ): Promise<RoomDto> {
    const createdRoom = await this.roomsService.createOne(createRoomDto, user);
    return plainToInstance(RoomDto, createdRoom.toObject());
  }

  @Patch(':id')
  async updateOne(
    @Param('id', MongoIdPipe) id: Types.ObjectId,
    @Body() room: UpdateRoomDto,
  ): Promise<RoomDto> {
    const updatedRoom = await this.roomsService.updateOne(id, room);
    return plainToInstance(RoomDto, updatedRoom.toObject());
  }

  @Delete(':id')
  async deleteOne(
    @Param('id', MongoIdPipe) id: Types.ObjectId,
  ): Promise<RoomDto> {
    const deletedRoom = await this.roomsService.deleteOne(id);
    return plainToInstance(RoomDto, deletedRoom.toObject());
  }
}
