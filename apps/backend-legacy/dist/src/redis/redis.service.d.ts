import { type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GameDTO } from 'src/game/dto/game.dto';
export declare class RedisService implements OnModuleInit, OnModuleDestroy {
    private readonly configService;
    private redisClient;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    set(key: string, value: string): Promise<"OK">;
    get(key: string): Promise<string>;
    setTTL(key: string, ttlSeconds: number): Promise<number>;
    setGame(key: string, value: GameDTO): Promise<"OK">;
    getGame(key: string): Promise<GameDTO>;
    getAllGames(): Promise<GameDTO[]>;
    deleteOneGame(key: string): Promise<boolean>;
    deleteAllGames(): Promise<GameDTO[]>;
    onModuleDestroy(): void;
}
