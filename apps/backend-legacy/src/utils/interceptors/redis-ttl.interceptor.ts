import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { RedisService } from '../../redis/redis.service';
import { WSDataDTO } from 'src/websocket/dto/websocket.dto';

@Injectable()
export class RedisTtlInterceptor implements NestInterceptor {
  private readonly ttlSeconds = 60 * 60 * 3;

  constructor(private readonly redisService: RedisService) {}

  // biome-ignore lint/suspicious/noExplicitAny: TODO any type
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Vérifier qu'on est bien dans un contexte WebSocket
    const ctxType = context.getType<'ws' | 'rpc' | 'http'>();
    if (ctxType === 'ws') {
      const wsCtx = context.switchToWs();
      const data = wsCtx.getData();
      // Extraction du code depuis le payload
      const code: WSDataDTO['code'] = data.code;
      if (code) {
        const key = code; // Use the game code to construct the Redis key
        // from() transforms the Promise into an Observable
        return from(this.redisService.getGame(code)).pipe(
          switchMap((game) => {
            if (game) {
              return from(
                this.redisService.setTTL(key, this.ttlSeconds), // Set TTL to 3 hours
              );
            }
            return from(Promise.resolve(null));
          }),
          // Once the TTL is refreshed (or not), pass the WebSocket request to the next handler
          switchMap(() => next.handle()),
        );
      }
    }
    // Si pas WS ou pas d'ID, on passe directement au handler
    return next.handle();
  }
}
