import { AppService } from './app.service';
import { RedisService } from './redis/redis.service';
export declare class AppController {
    private readonly appService;
    private readonly redisService;
    constructor(appService: AppService, redisService: RedisService);
    getHello(): string;
    testRedis(): Promise<{
        message: string;
    }>;
}
