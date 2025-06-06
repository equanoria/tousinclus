import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { DirectusModule } from 'src/directus/directus.module';

@Module({
  imports: [ConfigModule, CacheModule.register(), JwtModule, DirectusModule],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
