"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const sdk_1 = require("@directus/sdk");
const cache_manager_1 = require("@nestjs/cache-manager");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const node_crypto_1 = require("node:crypto");
const common_2 = require("@nestjs/common");
const directus_service_1 = require("../../directus/directus.service");
let AuthService = AuthService_1 = class AuthService {
    constructor(cacheManager, jwtService, directusService) {
        this.cacheManager = cacheManager;
        this.jwtService = jwtService;
        this.directusService = directusService;
        this.logger = new common_1.Logger(AuthService_1.name);
        this.TOKEN_CACHE_KEY = 'AUTH_TOKEN';
    }
    async getUserId(accessToken) {
        const customDirectusClient = (0, sdk_1.createDirectus)(this.directusService.getDirectusUrl()).with((0, sdk_1.rest)());
        const user = await customDirectusClient.request((0, sdk_1.withToken)(accessToken, (0, sdk_1.readMe)()));
        return user;
    }
    hashToken(token) {
        return (0, node_crypto_1.createHash)('sha256').update(token).digest('hex');
    }
    async validateAccessToken(accessToken) {
        const tokenHash = this.hashToken(accessToken);
        const user = await this.cacheManager.get(`${this.TOKEN_CACHE_KEY}:${tokenHash}`);
        if (user) {
            this.logger.log('Token retrieved from cache', user);
            return user;
        }
        let decodedJwt;
        try {
            decodedJwt = this.jwtService.decode(accessToken);
        }
        catch (error) {
            this.logger.error('Error decoding JWT', error);
            throw new common_2.UnauthorizedException('Invalid token');
        }
        decodedJwt.exp *= 1000;
        const now = Date.now();
        if (decodedJwt.exp < now) {
            throw new common_2.UnauthorizedException('Token has expired');
        }
        const { id } = await this.getUserId(accessToken);
        const roles = await this.directusService.getUserRoles(id);
        const newUser = {
            id,
            roles,
        };
        const ttl = decodedJwt.exp - now;
        await this.cacheManager.set(`${this.TOKEN_CACHE_KEY}:${tokenHash}`, newUser, ttl);
        this.logger.log('Access token cached', id);
        return newUser;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object, jwt_1.JwtService,
        directus_service_1.DirectusService])
], AuthService);
//# sourceMappingURL=auth.service.js.map