import { Module } from '@nestjs/common';
import { DirectusController } from './directus.controller';
import { DirectusService } from './directus.service';
import { FormatterService } from './formatter.service';
import { CacheConfigModule } from 'src/cache/cache.module';
import { LanguageService } from './language.service';

@Module({
  imports: [CacheConfigModule],
  controllers: [DirectusController],
  providers: [DirectusService, FormatterService, LanguageService],
  exports: [],
})
export class DirectusModule {}
