import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RoomDocument } from './schemas/room.schema';
import { CreateRoomDto } from './dto/create-room.dto';
import { DirectusService } from 'src/directus/directus.service';
import { UserDto } from 'src/users/dto/user.dto';
import { RoomDto } from './dto/room.dto';

@Injectable()
export class RoomsService {
  private readonly logger = new Logger(RoomsService.name);
  private static readonly MAX_ATTEMPTS = 10;

  constructor(
    @InjectModel(RoomDocument.name)
    private readonly roomModel: Model<RoomDocument>,
    private readonly directusService: DirectusService,
  ) {}

  async getOne(id: Types.ObjectId): Promise<RoomDocument | null> {
    const room = await this.roomModel.findById(id).exec();

    if (!room) {
      this.logger.error(`Failed to delete room with ID: ${id}`);
      throw new NotFoundException(`Room with ID: ${id} not found`);
    }

    return room;
  }

  async createOne(room: CreateRoomDto, user: UserDto): Promise<RoomDocument> {
    const code = await this.generateRandomCode();
    const { default_deck_group } = await this.directusService.getConfig();

    const createdRoom = await new this.roomModel({
      deckGroupId: default_deck_group,
      ...room,
      createdBy: user.id,
      code,
    }).save();

    if (!createdRoom) {
      this.logger.error('Failed to create room', room);
      throw new Error('Failed to create room');
    }

    return createdRoom;
  }

  async updateOne(
    id: Types.ObjectId,
    room: Partial<RoomDto>,
  ): Promise<RoomDocument> {
    const updatedRoom = await this.roomModel
      .findByIdAndUpdate(id, room, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!updatedRoom) {
      this.logger.error(`Failed to update room with ID: ${id}`, room);
      throw new NotFoundException(`Failed to update room with ID: ${id}`);
    }

    return updatedRoom;
  }

  async deleteOne(id: Types.ObjectId): Promise<RoomDocument> {
    const deletedRoom = await this.roomModel.findByIdAndDelete(id).exec();

    if (!deletedRoom) {
      this.logger.error(`Failed to delete room with ID: ${id}`);
      throw new NotFoundException(`Room with ID: ${id} not found`);
    }

    return deletedRoom;
  }

  async findByCode(code: string): Promise<RoomDocument | null> {
    const room = await this.roomModel.findOne({ code }).exec();
    return room ?? null;
  }

  private async generateRandomCode(): Promise<string> {
    for (let i = 0; i < RoomsService.MAX_ATTEMPTS; i++) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const exists = await this.roomModel.exists({ code });
      if (!exists) return code;
    }
    throw new Error('Unable to generate a unique code after several attempts');
  }
}
