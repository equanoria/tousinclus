import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Headers,
} from '@nestjs/common';
import { createDirectus, staticToken, rest } from '@directus/sdk';
import { DirectusService } from './directus.service';
import type { ICard, IGroup, IDeck } from './interfaces/directus.interface';
import { LanguageService } from './language.service';

// ? Typing to add for Directus https://docs.directus.io/guides/sdk/types.html

const client = createDirectus(
  process.env.DIRECTUS_URL || 'http://127.0.0.1:3002',
)
  .with(
    staticToken(
      process.env.DIRECTUS_ADMIN_TOKEN || 'ssHmmuIXSHHbnsxsTTKeSqIuc1e66diF',
    ),
  )
  .with(rest());

@Controller('directus')
export class DirectusController {
  constructor(
    private readonly directusService: DirectusService,
    private readonly languageService: LanguageService,
  ) {}

  // ========== CARD ==========
  @Get('card/:type/:id')
  async getOneCard(
    @Headers('accept-language') requestLanguage: ICard['requestLanguage'],
    @Param('type') type: ICard['type'],
    @Param('id') id: ICard['id'],
  ): Promise<unknown> {
    const languageCode = await this.languageService.getPreferredLanguage(
      requestLanguage,
      client,
    );

    if (
      !(type === 'users' || type === 'situations' || type === 'design-for-all')
    ) {
      throw new NotFoundException(`Type ${type} don't exist`);
    }

    const card = await this.directusService.handleCardRequest(
      client,
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
  async getAllCard(
    @Headers('accept-language') requestLanguage: ICard['requestLanguage'],
    @Param('type') type: ICard['type'],
  ): Promise<unknown> {
    const languageCode = await this.languageService.getPreferredLanguage(
      requestLanguage,
      client,
    );

    if (
      !(type === 'users' || type === 'situations' || type === 'design-for-all')
    ) {
      throw new NotFoundException(`Type ${type} don't exist`);
    }

    const cards = await this.directusService.handleCardRequest(
      client,
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
  async getOneGroup(
    @Headers('accept-language') requestLanguage: ICard['requestLanguage'],
    @Param('id') id: IGroup['id'],
  ): Promise<unknown> {
    const languageCode = await this.languageService.getPreferredLanguage(
      requestLanguage,
      client,
    );

    const group = await this.directusService.handleGroupRequest(
      client,
      languageCode,
      id,
    );

    if (!group.length) {
      throw new NotFoundException(`No card group with id : ${id} found`);
    }

    return group;
  }

  @Get('group')
  async getAllGroup(
    @Headers('accept-language') requestLanguage: IGroup['languageCode'],
  ): Promise<unknown> {
    const languageCode = await this.languageService.getPreferredLanguage(
      requestLanguage,
      client,
    );

    const group = await this.directusService.handleGroupRequest(
      client,
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
  async getOneDeck(
    @Headers('accept-language') requestLanguage: IDeck['languageCode'],
    @Param('id') id: IDeck['id'],
  ): Promise<unknown> {
    const languageCode = await this.languageService.getPreferredLanguage(
      requestLanguage,
      client,
    );

    const group = await this.directusService.handleDeckRequest(
      client,
      languageCode,
      id,
    );

    if (!group.length) {
      throw new NotFoundException(`No card deck with id : ${id} found`);
    }

    return group;
  }

  @Get('deck')
  async getAllDeck(
    @Headers('accept-language') requestLanguage: IDeck['languageCode'],
  ): Promise<unknown> {
    const languageCode = await this.languageService.getPreferredLanguage(
      requestLanguage,
      client,
    );

    const group = await this.directusService.handleDeckRequest(
      client,
      languageCode,
      null,
    );

    if (!group.length) {
      throw new NotFoundException('No card deck found, database may be empty');
    }

    return group;
  }
}
