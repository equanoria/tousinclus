import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  private readonly TOKEN_CACHE_KEY = 'AUTH_TOKEN';

  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException();
    }

    const accessToken = authHeader.split(' ')[1];

    const id = await this.cacheManager.get<string>(
      `${this.TOKEN_CACHE_KEY}:${accessToken}`,
    );

    if (id) {
      this.logger.log('Token retrieved from cache', id);
      request.user = { id };
      return true;
    }

    const decodedJwt = this.jwtService.decode(accessToken);
    if (
      typeof decodedJwt !== 'object' ||
      !decodedJwt ||
      !('exp' in decodedJwt)
    ) {
      throw new UnauthorizedException('Invalid token');
    }

    decodedJwt.exp *= 1000; // Convert to milliseconds

    const currentTimestamp = Date.now();
    if (decodedJwt.exp < currentTimestamp) {
      throw new UnauthorizedException('Token has expired');
    }

    try {
      const { id } = await this.authService.getUserId(accessToken);
      const ttl = decodedJwt.exp - currentTimestamp;

      await this.cacheManager.set(
        `${this.TOKEN_CACHE_KEY}:${accessToken}`,
        id,
        ttl,
      );
      this.logger.log('Access token cached', id);

      request.user = { id };

      return true;
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException('Unable to verify your credentials');
    }
  }
}
