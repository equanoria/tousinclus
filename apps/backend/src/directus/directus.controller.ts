import {
    Controller,
    Get,
    Put,
    Param,
    NotFoundException,
} from '@nestjs/common';
import { createDirectus, staticToken, rest } from '@directus/sdk';
import { DirectusService } from './directus.service';
import { ICard, IGroup } from './interfaces/directus.interface';

// ? Typage à ajouter pour Directus https://docs.directus.io/guides/sdk/types.html

const client = createDirectus('http://localhost:3002')
    .with(staticToken(process.env.DIRECTUS_ADMIN_TOKEN || 'ssHmmuIXSHHbnsxsTTKeSqIuc1e66diF'))
    .with(rest());

@Controller('directus')
export class DirectusController {

    constructor(private readonly directusService: DirectusService) { }

    @Get(':languageCode/card/:type/:id')
    async getOneCard(
        @Param('languageCode') languageCode: ICard['languageCode'],
        @Param('type') type: ICard['type'],
        @Param('id') id: ICard['id']
    ): Promise<unknown> {

        if (!(languageCode === "en" || languageCode === "fr")) {
            throw new NotFoundException('language not supported');
        }

        if (!(type === "users" || type === "situations" || type === "design-for-all")) {
            throw new NotFoundException(`Type ${type} don't exist`);
        }

        const card = await this.directusService.handleCardRequest(client, languageCode, type, id)

        if (!card.length) {
            throw new NotFoundException(`No card with id : ${id} found`);
        }

        return card

        // ? On renvoie comment l'image
    }

    @Get(':languageCode/card/:type')
    async getAllCard(
        @Param('languageCode') languageCode: ICard['languageCode'],
        @Param('type') type: ICard['type'],
    ): Promise<unknown> {

        if (!(languageCode === "en" || languageCode === "fr")) {
            throw new NotFoundException('language not supported');
        }

        if (!(type === "users" || type === "situations" || type === "design-for-all")) {
            throw new NotFoundException(`Type ${type} don't exist`);
        }

        const cards = await this.directusService.handleCardRequest(client, languageCode, type, null)

        if (!cards.length) {
            throw new NotFoundException(`No card ${type} found`);
        }

        return cards

        // ? On renvoie comment l'image
    }

    @Get(':languageCode/group/:id')
    async getOneGroup(
        @Param('languageCode') languageCode: IGroup['languageCode'],
        @Param('id') id: IGroup['id']
    ): Promise<unknown> {

        if (!(languageCode === "en" || languageCode === "fr")) {
            throw new NotFoundException('language not supported');
        }

        const group = await this.directusService.handleGroupRequest(client, languageCode, id)

        if (!group.length) {
            throw new NotFoundException(`No card with id : ${id} found`);
        }
        
        return group
    }

    @Get(':languageCode/group')
    async getAllGroup(
        @Param('languageCode') languageCode: IGroup['languageCode'],
    ): Promise<unknown> {

        if (!(languageCode === "en" || languageCode === "fr")) {
            throw new NotFoundException('language not supported');
        }

        const group = await this.directusService.handleGroupRequest(client, languageCode, null)

        if (!group.length) {
            throw new NotFoundException(`No card group found`);
        }

        return group
    }
}