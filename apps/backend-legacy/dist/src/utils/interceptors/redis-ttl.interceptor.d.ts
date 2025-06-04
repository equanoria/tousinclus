import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RedisService } from '../../redis/redis.service';
export declare class RedisTtlInterceptor implements NestInterceptor {
    private readonly redisService;
    private readonly ttlSeconds;
    constructor(redisService: RedisService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
