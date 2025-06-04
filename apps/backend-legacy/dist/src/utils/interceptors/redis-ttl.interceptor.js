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
exports.RedisTtlInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const redis_service_1 = require("../../redis/redis.service");
let RedisTtlInterceptor = class RedisTtlInterceptor {
    constructor(redisService) {
        this.redisService = redisService;
        this.ttlSeconds = 60 * 60 * 3;
    }
    intercept(context, next) {
        const ctxType = context.getType();
        if (ctxType === 'ws') {
            const wsCtx = context.switchToWs();
            const data = wsCtx.getData();
            const code = data.code;
            if (code) {
                const key = code;
                return (0, rxjs_1.from)(this.redisService.getGame(code)).pipe((0, operators_1.switchMap)((game) => {
                    if (game) {
                        return (0, rxjs_1.from)(this.redisService.setTTL(key, this.ttlSeconds));
                    }
                    return (0, rxjs_1.from)(Promise.resolve(null));
                }), (0, operators_1.switchMap)(() => next.handle()));
            }
        }
        return next.handle();
    }
};
exports.RedisTtlInterceptor = RedisTtlInterceptor;
exports.RedisTtlInterceptor = RedisTtlInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService])
], RedisTtlInterceptor);
//# sourceMappingURL=redis-ttl.interceptor.js.map