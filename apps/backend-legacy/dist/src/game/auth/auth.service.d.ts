import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';
import { DirectusService } from 'src/directus/directus.service';
import { IUser } from '@tousinclus/types';
interface IReadme {
    id: string;
}
export declare class AuthService {
    private readonly cacheManager;
    private readonly jwtService;
    private readonly directusService;
    private readonly logger;
    private readonly TOKEN_CACHE_KEY;
    constructor(cacheManager: Cache, jwtService: JwtService, directusService: DirectusService);
    getUserId(accessToken: string): Promise<IReadme>;
    private hashToken;
    validateAccessToken(accessToken: string): Promise<IUser>;
}
export {};
