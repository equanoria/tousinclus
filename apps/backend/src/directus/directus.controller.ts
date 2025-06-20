import {
  Controller,
  Get,
  Headers,
  NotFoundException,
  Param,
} from '@nestjs/common';

// ========== Directus SDK Import ==========
import { DirectusService } from './directus.service';

// ========== DTO Import ==========
import { ICardDTO, IDeckDTO, IGroupDTO } from './dto/directus.dto';

import {
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HTTPResponseDTO } from 'src/utils/dto/response.dto';
// ========== Services Import ==========
import { LanguageService } from '../utils/services/language.service';

// ? Typing to add for Directus https://docs.directus.io/guides/sdk/types.html

@ApiTags('Directus')
@Controller('directus')
export class DirectusController {
  constructor(
    private readonly directusService: DirectusService,
    private readonly languageService: LanguageService,
  ) {}

  // ========== CARD ==========
  @Get('card/:type/:id')
  @ApiOperation({ summary: 'Retrieve a specific card by Type and ID' })
  @ApiHeader({
    name: 'accept-language',
    required: true,
    enum: ['en-US', 'fr-FR'],
    example: 'en-US',
  })
  @ApiParam({
    name: 'type',
    description: 'Type of the card',
    enum: ['users', 'situations'],
    example: 'users',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the card',
    example: 42,
  })
  @ApiResponse({
    status: 200,
    description: 'Card retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'No card found with the given ID or invalid type',
    type: HTTPResponseDTO,
  })
  async getOneCard(
    @Headers('accept-language') requestLanguage: ICardDTO['requestLanguage'],
    @Param('type') type: ICardDTO['type'],
    @Param('id') id: ICardDTO['id'],
  ): Promise<unknown> {
    const languageCode =
      await this.languageService.getPreferredLanguage(requestLanguage);

    if (!(type === 'users' || type === 'situations')) {
      throw new NotFoundException(`Type ${type} don't exist`);
    }

    const card = await this.directusService.handleCardRequest(
      languageCode,
      type,
      id,
    );

    if (!card.length) {
      throw new NotFoundException(`No card with id : ${id} found`);
    }

    return card;

    // ? How do we return the image
  }

  @Get('card/:type')
  @ApiOperation({ summary: 'Retrieve all cards by Type' })
  @ApiHeader({
    name: 'accept-language',
    required: true,
    enum: ['en-US', 'fr-FR'],
    example: 'en-US',
  })
  @ApiParam({
    name: 'type',
    description: 'Type of the card',
    enum: ['users', 'situations'],
    example: 'users',
  })
  @ApiResponse({
    status: 200,
    description: 'Cards retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'No card found or invalid type',
    type: HTTPResponseDTO,
  })
  async getAllCard(
    @Headers('accept-language') requestLanguage: ICardDTO['requestLanguage'],
    @Param('type') type: ICardDTO['type'],
  ): Promise<unknown> {
    const languageCode =
      await this.languageService.getPreferredLanguage(requestLanguage);

    if (!(type === 'users' || type === 'situations')) {
      throw new NotFoundException(`Type ${type} don't exist`);
    }

    const cards = await this.directusService.handleCardRequest(
      languageCode,
      type,
      null,
    );

    if (!cards.length) {
      throw new NotFoundException(
        `No card ${type} found, database may be empty`,
      );
    }

    return cards;

    // ? How do we return the image
  }

  // ========== GROUP ==========
  @Get('group/:id')
  @ApiOperation({ summary: 'Retrieve group by ID' })
  @ApiHeader({
    name: 'accept-language',
    required: true,
    enum: ['en-US', 'fr-FR'],
    example: 'en-US',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the group',
    example: 42,
  })
  @ApiResponse({
    status: 200,
    description: 'Group retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'No group found with given ID',
    type: HTTPResponseDTO,
  })
  async getOneGroup(
    @Headers('accept-language') requestLanguage: ICardDTO['requestLanguage'],
    @Param('id') id: IGroupDTO['id'],
  ): Promise<unknown> {
    const languageCode =
      await this.languageService.getPreferredLanguage(requestLanguage);

    const group = await this.directusService.handleGroupRequest(
      languageCode,
      id,
    );

    if (!group.length) {
      throw new NotFoundException(`No card group with id : ${id} found`);
    }

    return group;
  }

  @Get('group')
  @ApiOperation({ summary: 'Retrieve all group' })
  @ApiHeader({
    name: 'accept-language',
    required: true,
    enum: ['en-US', 'fr-FR'],
    example: 'en-US',
  })
  @ApiResponse({
    status: 200,
    description: 'Groups retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'No group found',
    type: HTTPResponseDTO,
  })
  async getAllGroup(
    @Headers('accept-language') requestLanguage: IGroupDTO['requestLanguage'],
  ): Promise<unknown> {
    const languageCode =
      await this.languageService.getPreferredLanguage(requestLanguage);

    const group = await this.directusService.handleGroupRequest(
      languageCode,
      null,
    );

    if (!group.length) {
      throw new NotFoundException('No card group found, database may be empty');
    }

    return group;
  }

  // ========== DECK ==========
  @Get('deck/:id')
  @ApiOperation({ summary: 'Retrieve deck by ID' })
  @ApiHeader({
    name: 'accept-language',
    required: true,
    enum: ['en-US', 'fr-FR'],
    example: 'en-US',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the deck',
    example: 42,
  })
  @ApiResponse({
    status: 200,
    description: 'Deck retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'No deck found with given ID',
    type: HTTPResponseDTO,
  })
  async getOneDeck(
    @Headers('accept-language') requestLanguage: IDeckDTO['requestLanguage'],
    @Param('id') id: IDeckDTO['id'],
  ): Promise<unknown> {
    const languageCode =
      await this.languageService.getPreferredLanguage(requestLanguage);

    const group = await this.directusService.handleDeckRequest(
      languageCode,
      id,
    );

    if (!group.length) {
      throw new NotFoundException(`No card deck with id : ${id} found`);
    }

    return group;
  }

  @Get('deck')
  @ApiOperation({ summary: 'Retrieve all deck' })
  @ApiHeader({
    name: 'accept-language',
    required: true,
    enum: ['en-US', 'fr-FR'],
    example: 'en-US',
  })
  @ApiResponse({
    status: 200,
    description: 'Decks retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'No deck found',
    type: HTTPResponseDTO,
  })
  async getAllDeck(
    @Headers('accept-language') requestLanguage: IDeckDTO['requestLanguage'],
  ): Promise<unknown> {
    const languageCode =
      await this.languageService.getPreferredLanguage(requestLanguage);

    const group = await this.directusService.handleDeckRequest(
      languageCode,
      null,
    );

    if (!group.length) {
      throw new NotFoundException('No card deck found, database may be empty');
    }

    return group;
  }
}
