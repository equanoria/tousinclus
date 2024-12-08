import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Game } from '../game/interfaces/game.interface';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redisClient: Redis;

  onModuleInit() {
    this.redisClient = new Redis({
      host: process.env.REDIS_HOSTNAME || 'localhost',
      port: parseInt(process.env.REDIS_PORT, 10) || 3004,
    });
    console.log('Redis client initialized');
  }

  async set(key: string, value: string) {
    return this.redisClient.set(key, value);
  }

  async get(key: string) {
    return this.redisClient.get(key);
  }

  // ========== Game ==========

  async setGame(key: string, value: Game) {
    return this.redisClient.set(key, JSON.stringify(value));
  }

  async getGame(key: string): Promise<Game> {
    const gameData = await this.redisClient.get(key);
    return JSON.parse(gameData) as Game;
  }

  async getAllGames(): Promise<Game[]> {
    const keys = await this.redisClient.keys('*');

    // Si aucun jeu n'est enregistré
    if (keys.length === 0) {
      return [];
    }

    const gameDataArray = await this.redisClient.mget(keys); // Récupère toutes les valeurs en une seule commande
    return gameDataArray
      .map((gameData) => {
        try {
          const parsedGame = JSON.parse(gameData);
          return parsedGame && parsedGame.code && parsedGame.status ? parsedGame : null;
        } catch (error) {
          console.error(`Error parsing game data:`, error);
          return null;
        }
      })
      .filter((game) => game !== null); // Supprime les entrées nulles
  }

  async deleteOneGame(key: string): Promise<boolean> {
    const result = await this.redisClient.del(key);
    return result > 0;
  }

  onModuleDestroy() {
    this.redisClient.disconnect();
    console.log('Redis client disconnected');
  }
}
