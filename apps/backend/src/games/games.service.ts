import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GameDocument } from './schemas/game.schema';
import { GameDto } from './dto/game.dto';
import { plainToClass } from 'class-transformer';
import { GAME_MODEL } from './constants';

@Injectable()
export class GamesService {
  private readonly logger = new Logger(GamesService.name);

  constructor(
    @InjectModel(GAME_MODEL)
    private readonly gameModel: Model<GameDocument>,
  ) {}

  async findOne(_id: Types.ObjectId): Promise<GameDto | null> {
    const game = await this.gameModel.findById(_id).exec();
    return game ? plainToClass(GameDto, game.toObject()) : null;
  }
}
