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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = require("ioredis");
let RedisService = class RedisService {
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        this.redisClient = new ioredis_1.default({
            host: this.configService.get('REDIS_HOSTNAME'),
            port: this.configService.get('REDIS_PORT'),
        });
        console.log('Redis client initialized');
    }
    async set(key, value) {
        return this.redisClient.set(key, value);
    }
    async get(key) {
        return this.redisClient.get(key);
    }
    async setTTL(key, ttlSeconds) {
        return this.redisClient.expire(key, ttlSeconds);
    }
    async setGame(key, value) {
        return this.redisClient.set(key, JSON.stringify(value));
    }
    async getGame(key) {
        const gameData = await this.redisClient.get(key);
        return JSON.parse(gameData);
    }
    async getAllGames() {
        const keys = await this.redisClient.keys('*');
        if (keys.length === 0) {
            return [];
        }
        const gameDataArray = await this.redisClient.mget(keys);
        return gameDataArray
            .map((gameData) => {
            try {
                const parsedGame = JSON.parse(gameData);
                return parsedGame?.code && parsedGame.status ? parsedGame : null;
            }
            catch (error) {
                console.error('Error parsing game data:', error);
                return null;
            }
        })
            .filter((game) => game !== null);
    }
    async deleteOneGame(key) {
        const result = await this.redisClient.del(key);
        return result > 0;
    }
    async deleteAllGames() {
        const keys = await this.redisClient.keys('*');
        if (keys.length === 0) {
            return [];
        }
        const gameDataArray = await this.redisClient.mget(keys);
        await this.redisClient.del(keys);
        return gameDataArray
            .map((gameData) => {
            try {
                return JSON.parse(gameData);
            }
            catch (error) {
                console.error('Error parsing game data:', error);
                return null;
            }
        })
            .filter((game) => game !== null);
    }
    onModuleDestroy() {
        this.redisClient.disconnect();
        console.log('Redis client disconnected');
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RedisService);
//# sourceMappingURL=redis.service.js.map