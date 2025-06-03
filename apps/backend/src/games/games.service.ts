import { Injectable, Logger } from '@nestjs/common';
import { RoomsService } from 'src/rooms/rooms.service';
import { DirectusService } from 'src/directus/directus.service';
import { RoomDocument } from 'src/rooms/schemas/room.schema';
import { GameDocument } from './schemas/game.schema';

@Injectable()
export class GamesService {
  private readonly logger = new Logger(GamesService.name);

  constructor(
    private readonly roomService: RoomsService,
    private readonly directusService: DirectusService,
  ) {}

  async createOne(room: RoomDocument): Promise<GameDocument> {
    const excludeDeckIds = room.games.map((game) => game.cardDeckId);
    const cardDeckId = this.directusService.getRandomCardDeck(
      room.deckGroupId,
      excludeDeckIds,
    );
    const createdGame = room.games.create({
      cardDeckId,
    });

    room.games.push(createdGame);
    await room.save();

    return createdGame;
  }
}
