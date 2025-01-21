import { Module } from '@nestjs/common';
import { DirectusController } from './directus.controller';
import { DirectusService } from './directus.service';
import { FormatterService } from './formatter.service';

@Module({
    imports:[],
    controllers: [DirectusController],
    providers: [DirectusService, FormatterService],
    exports: []
})
export class DirectusModule {}