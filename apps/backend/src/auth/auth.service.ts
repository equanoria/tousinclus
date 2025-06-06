import { createHash } from 'node:crypto';
import { createDirectus, readMe, rest, withToken } from '@directus/sdk';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { IUser } from '@tousinclus/types';
import { Cache } from 'cache-manager';
import { JwtPayload } from 'jsonwebtoken';
import { DirectusService } from 'src/directus/directus.service';
import { IUser } from '@tousinclus/types';
import { IReadme } from './types/Readme';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly TOKEN_CACHE_KEY = 'AUTH_TOKEN';

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly jwtService: JwtService,
    private readonly directusService: DirectusService,
  ) {}

  async getUserId(accessToken: string): Promise<IReadme> {
    const customDirectusClient = createDirectus(
      this.directusService.getDirectusUrl(),
    ).with(rest());

    const user = await customDirectusClient.request<IReadme>(
      withToken(accessToken, readMe()),
    );

    return user;
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  async validateAccessToken(accessToken: string): Promise<IUser> {
    const tokenHash = this.hashToken(accessToken);

    const user = await this.cacheManager.get<IUser>(
      `${this.TOKEN_CACHE_KEY}:${tokenHash}`,
    );
    if (user) {
      this.logger.log('Token retrieved from cache', user);
      return user;
    }

    const decodedJwt = this.jwtService.decode<JwtPayload>(accessToken);
    if (!decodedJwt) {
      this.logger.error('Error decoding JWT');
      throw new UnauthorizedException('Invalid token');
    }

    decodedJwt.exp *= 1000; // Convert to milliseconds

    const now = Date.now();
    if (decodedJwt.exp < now) {
      throw new UnauthorizedException('Token has expired');
    }

    const { id } = await this.getUserId(accessToken);
    const roles = await this.directusService.getUserRoles(id);

    const newUser: IUser = {
      id,
      roles,
    };

    const ttl = decodedJwt.exp - now;
    await this.cacheManager.set(
      `${this.TOKEN_CACHE_KEY}:${tokenHash}`,
      newUser,
      ttl,
    );

    this.logger.log('Access token cached', id);

    return newUser;
  }
}
