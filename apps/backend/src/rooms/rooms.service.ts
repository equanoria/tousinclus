import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GameDocument, Room, RoomDocument } from './schemas/room.schema';
import { WebhookBeds24PayloadDto } from './dto/create-update-game.dto';
import { GameDto } from './dto/game.dto';
import { plainToClass } from 'class-transformer';
import { DateUtils } from 'src/utils/DateUtils';
import parsePhoneNumberFromString, { CountryCode } from 'libphonenumber-js';
import { IFlow } from '@tousinclus/types';
import { Beds24Service } from 'src/beds24/beds24.service';

@Injectable()
export class GamesService {
  private readonly logger = new Logger(GamesService.name);

  constructor(
    @InjectModel(Room.name)
    private readonly roomModel: Model<RoomDocument>,
  ) {}

  async findOne(_id: Types.ObjectId): Promise<GameDto | null> {
    const game = await this.gameModel.findById(_id).exec();
    return game ? plainToClass(GameDto, game.toObject()) : null;
  }

  async createOrUpdate(
    createUpdateGameDto: GameDto,
  ): Promise<GameDto> {
    const { beds24id } = createUpdateGameDto;

    const existingGame = await this.gameModel
      .findOne({ beds24id })
      .exec();

    if (existingGame) {
      const game = await this.gameModel
        .findOneAndUpdate({ beds24id }, createUpdateGameDto, { new: true })
        .exec();

      return plainToClass(GameDto, game.toObject());
    }

    const newGame = new this.gameModel(createUpdateGameDto);
    const result = await newGame.save();

    return plainToClass(GameDto, result.toObject());
  }

  async update(gameDto: GameDto): Promise<GameDto> {
    const game = await this.gameModel
      .findByIdAndUpdate(gameDto._id, gameDto, { new: true })
      .exec();

    if (!game) {
      throw new Error('Game not found');
    }

    return plainToClass(GameDto, game.toObject());
  }

  async addFlow(
    gameDto: GameDto,
    flow: Omit<IFlow, 'createdAt' | 'updatedAt'>,
  ): Promise<GameDto> {
    if (gameDto.flows.find((f) => f.name === flow.name)) {
      this.logger.warn(
        `Flow ${flow.name} already exists for game ${gameDto._id}`,
      );
      return;
    }

    const flowWithTimestamps: IFlow = {
      ...flow,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    gameDto.flows.push(flowWithTimestamps);

    const game = await this.gameModel
      .findByIdAndUpdate(gameDto._id, gameDto, { new: true })
      .exec();

    return plainToClass(GameDto, game.toObject());
  }

  async updateFlow(
    gameDto: GameDto,
    flow: Omit<IFlow, 'createdAt' | 'updatedAt'>,
  ): Promise<GameDto> {
    const existingFlow = gameDto.flows.find((f) => f.name === flow.name);

    const flowWithTimestamps: IFlow = {
      ...existingFlow,
      ...flow,
      updatedAt: new Date(),
    };

    gameDto.flows = [
      ...gameDto.flows.filter((f) => f.name !== flow.name),
      flowWithTimestamps,
    ];

    const game = await this.gameModel
      .findByIdAndUpdate(gameDto._id, gameDto, { new: true })
      .exec();

    return plainToClass(GameDto, game.toObject());
  }

  async getFlowByName(
    gameDto: GameDto,
    flowName: string,
  ): Promise<IFlow | null> {
    const flow = gameDto.flows.find((f) => f.name === flowName);

    if (!flow) {
      this.logger.warn(
        `Flow ${flowName} not found for game ${gameDto._id}`,
      );
      return null;
    }

    return flow;
  }

  async transformWebhookPayload(
    payload: WebhookBeds24PayloadDto,
  ): Promise<GameDto> {
    const { game } = payload;

    const checkInDate = new DateUtils(game.arrival);
    const checkOutDate = new DateUtils(game.departure);
    const createdAt = new Date(game.gameTime);
    const updatedAt = new Date(game.modifiedTime);

    const beds24property = await this.beds24Service.getProperty(
      game.propertyId.toString(),
    );

    const [arrivalTime, departureTime] = [
      beds24property.checkInStart,
      beds24property.checkOutEnd,
    ];

    checkInDate.setTimeFromString(arrivalTime);
    checkOutDate.setTimeFromString(departureTime);

    const getLocaleIntl = (
      inputLang?: string,
      inputRegion?: string,
      phoneNumber?: string,
    ): Intl.Locale => {
      let lang = inputLang;
      let region = inputRegion;

      if (!lang && !region && phoneNumber) {
        const phone = parsePhoneNumberFromString(phoneNumber, 'FR');
        if (phone) {
          region = phone.country;
        }
      }

      if (!lang && region) {
        try {
          const locale = new Intl.Locale(`und-${region}`).maximize();
          lang = locale.language;
        } catch (error) {
          this.logger.warn(
            `Failed to deduce language from region "${region}".`,
            error.message,
          );
        }
      }

      let localeIntl: Intl.Locale;

      try {
        if (lang && region) {
          localeIntl = new Intl.Locale(`${lang}-${region}`).maximize();
        } else if (lang) {
          localeIntl = new Intl.Locale(lang).maximize();
        } else {
          localeIntl = new Intl.Locale('en-US').maximize();
        }
      } catch (error) {
        this.logger.warn(
          `Invalid locale format "${lang}-${region}". Defaulting to "en-US"`,
          error.message,
        );
        localeIntl = new Intl.Locale('en-US').maximize();
      }

      return localeIntl;
    };

    const localeIntl = getLocaleIntl(
      game.lang,
      game.country2,
      game.phone,
    );

    const normalizedPhone = parsePhoneNumberFromString(
      game.phone,
      (localeIntl.region as CountryCode) || 'FR',
    );

    return {
      beds24id: game.id.toString(),
      propertyId: game.propertyId.toString(),
      guest: {
        firstName: game.firstName,
        lastName: game.lastName,
        email: game.email,
        phone: normalizedPhone?.formatInternational(),
        locale: `${localeIntl.language}-${localeIntl.region}`,
      },
      dates: {
        checkIn: checkInDate,
        checkOut: checkOutDate,
      },
      status: game.status,
      createdAt: createdAt,
      updatedAt: updatedAt,
    };
  }
}
