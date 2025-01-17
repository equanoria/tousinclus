import { Module } from '@nestjs/common';
import { DirectusController } from './directus.controller';
import { DirectusService } from './directus.service';

@Module({
    imports:[],
    controllers: [DirectusController],
    providers: [DirectusService],
    exports: []
})
export class DirectusModule {}