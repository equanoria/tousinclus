import { Module } from '@nestjs/common';

import { DirectusController } from './directus.controller';

import { CacheConfigModule } from 'src/cache/cache.module';

import { LanguageService } from '../utils/services/language.service';
import { DirectusService } from './directus.service';
import { FormatterService } from '../utils/services/formatter.service';

@Module({
  imports: [CacheConfigModule],
  controllers: [DirectusController],
  providers: [DirectusService, FormatterService, LanguageService],
  exports: [DirectusService],
})
export class DirectusModule {}
