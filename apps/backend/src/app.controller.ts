import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { RedisService } from './redis/redis.service';
import { TRole } from '@tousinclus/types';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly redisService: RedisService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Redis test
  @Get('/redis-test')
  async testRedis() {
    await this.redisService.set('test-key', 'Hello Redis!'); // sending key-value
    const value = await this.redisService.get('test-key'); // receiving it from Redis
    return { message: value };
  }
}
