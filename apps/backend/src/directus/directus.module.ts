import { Module } from '@nestjs/common';

import { DirectusController } from './directus.controller';

import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { FormatterService } from '../utils/services/formatter.service';
import { LanguageService } from '../utils/services/language.service';
import { DirectusService } from './directus.service';

@Module({
  imports: [CacheModule.register(), ConfigModule],
  controllers: [DirectusController],
  providers: [DirectusService, FormatterService, LanguageService],
  exports: [DirectusService],
})
export class DirectusModule {}
