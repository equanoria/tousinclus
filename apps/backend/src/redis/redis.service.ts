import {
  Injectable,
  type OnModuleDestroy,
  type OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { GameDTO } from 'src/game/dto/game.dto';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redisClient: Redis;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.redisClient = new Redis({
      host: this.configService.get('REDIS_HOSTNAME'),
      port: this.configService.get<number>('REDIS_PORT'),
    });
    console.log('Redis client initialized');
  }

  async set(key: string, value: string) {
    return this.redisClient.set(key, value);
  }

  async get(key: string) {
    return this.redisClient.get(key);
  }

  async setTTL(key: string, ttlSeconds: number): Promise<number> {
    return this.redisClient.expire(key, ttlSeconds);
  }

  // ========== Game ==========

  async setGame(key: string, value: GameDTO) {
    return this.redisClient.set(key, JSON.stringify(value));
  }

  async getGame(key: string): Promise<GameDTO> {
    const gameData = await this.redisClient.get(key);
    return JSON.parse(gameData) as GameDTO;
  }

  async getAllGames(): Promise<GameDTO[]> {
    const keys = await this.redisClient.keys('*');

    // If no games are recorded
    if (keys.length === 0) {
      return [];
    }

    const gameDataArray = await this.redisClient.mget(keys); // Retrieve all values in a single command
    return gameDataArray
      .map((gameData) => {
        try {
          const parsedGame = JSON.parse(gameData);
          return parsedGame?.code && parsedGame.status ? parsedGame : null;
        } catch (error) {
          console.error('Error parsing game data:', error);
          return null;
        }
      })
      .filter((game) => game !== null); // Remove null entries
  }

  async deleteOneGame(key: string): Promise<boolean> {
    const result = await this.redisClient.del(key);
    return result > 0;
  }

  async deleteAllGames(): Promise<GameDTO[]> {
    const keys = await this.redisClient.keys('*');

    if (keys.length === 0) {
      return []; // No games to delete
    }

    const gameDataArray = await this.redisClient.mget(keys); // Retrieve all values before deletion
    await this.redisClient.del(keys); // Delete all keys

    return gameDataArray
      .map((gameData) => {
        try {
          return JSON.parse(gameData) as GameDTO;
        } catch (error) {
          console.error('Error parsing game data:', error);
          return null;
        }
      })
      .filter((game) => game !== null); // Remove null entries
  }

  onModuleDestroy() {
    this.redisClient.disconnect();
    console.log('Redis client disconnected');
  }
}
