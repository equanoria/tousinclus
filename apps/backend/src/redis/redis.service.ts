import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
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

  onModuleDestroy() {
    this.redisClient.disconnect();
    console.log('Redis client disconnected');
  }
}
