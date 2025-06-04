import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DirectusService } from 'src/directus/directus.service';
import { RoomDocument } from 'src/rooms/schemas/room.schema';
import { RedisClient } from 'src/redis/redis.module';
import { GameDto } from './dto/game.dto';
import { plainToInstance } from 'class-transformer';
import { Types } from 'mongoose';

@Injectable()
export class GamesService {
  private readonly logger = new Logger(GamesService.name);

  constructor(
    private readonly directusService: DirectusService,
    private readonly redisClient: RedisClient,
  ) {}

  async createOne(room: RoomDocument): Promise<GameDto> {
    const excludeDeckIds = room.games.map((game) => game.cardDeckId);
    const cardDeckId = this.directusService.getRandomCardDeck(
      room.deckGroupId,
      excludeDeckIds,
    );
    const mongoCreatedGame = room.games.create({
      cardDeckId,
    });

    room.games.push(mongoCreatedGame);
    await room.save();

    const thinking = {
      endsAt: new Date(Date.now() + room.config.thinkingDuration * 60 * 1000), // Minutes
    };

    const redisGame = {
      ...mongoCreatedGame,
      state: {
        thinking,
      },
    };

    await this.redisClient.set(
      `game:${redisGame._id.toString()}`,
      JSON.stringify(redisGame.toJSON()),
    );

    return plainToInstance(GameDto, mongoCreatedGame.toObject());
  }

  async getOne(id: Types.ObjectId): Promise<GameDto> {
    const rawGame = await this.redisClient.get(`game:${id.toString()}`);
    const game = JSON.parse(rawGame);

    if (!game) {
      this.logger.error(`Game with ID ${id} not found in Redis`);
      throw new NotFoundException(`Game with ID ${id} not found`);
    }

    return plainToInstance(GameDto, game);
  }
}
