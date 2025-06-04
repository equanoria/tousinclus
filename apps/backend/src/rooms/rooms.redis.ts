import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { RoomDocument } from './schemas/room.schema';
import { RoomDto } from './dto/room.dto';
import { RedisClient } from 'src/redis/redis.module';
import { plainToInstance } from 'class-transformer';
import { RedisRoomDto } from './dto/redis-room.dto';

@Injectable()
export class RoomsRedis {
  private readonly logger = new Logger(RoomsRedis.name);
  private static readonly ROOM_MAX_TTL = 72; // Hours

  constructor(
    @InjectModel(RoomDocument.name)
    private readonly redisClient: RedisClient,
  ) {}

  async getOne(id: Types.ObjectId): Promise<RoomDocument> {
    const redisRoom = await this.redisClient.get(`room:${id.toString()}`);

    if (!redisRoom) {
      this.logger.error(`Room with ID ${id} not found in Redis`);
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    return JSON.parse(redisRoom);
  }

  async createOne(room: RoomDocument): Promise<RedisRoomDto> {
    const existingRoom = plainToInstance(RoomDto, room.toObject());
    const { _id, teams } = existingRoom;
    const redisRoom: RedisRoomDto = {
      _id,
      teams,
    };

    await this.redisClient.set(
      `room:${room._id.toString()}`,
      JSON.stringify(redisRoom),
      'EX',
      RoomsRedis.ROOM_MAX_TTL * 60 * 60,
    );

    return redisRoom;
  }

  async updateOne(
    id: Types.ObjectId,
    room: Partial<RoomDto>,
  ): Promise<RoomDocument> {
    const rawExistingRoom = await this.redisClient.get(`room:${id.toString()}`);

    if (!rawExistingRoom) {
      this.logger.error(`Room with ID ${id} not found in Redis`);
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    const existingRoom = JSON.parse(rawExistingRoom);

    const updatedRoom = { ...existingRoom, ...room };
    await this.redisClient.set(
      `room:${id.toString()}`,
      JSON.stringify(updatedRoom),
      'EX',
      RoomsRedis.ROOM_MAX_TTL * 60 * 60,
    );

    return updatedRoom;
  }

  async deleteOne(id: Types.ObjectId): Promise<Types.ObjectId | null> {
    const deleted = await this.redisClient.del(`room:${id.toString()}`);

    if (deleted === 0) {
      this.logger.warn(`Room with ID ${id} not found in Redis`);
      return null;
    }

    this.logger.log(`Room with ID ${id} deleted from Redis`);
    return id;
  }
}
