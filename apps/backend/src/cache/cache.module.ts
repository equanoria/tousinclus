import { CacheModule } from '@nestjs/cache-manager';
import { Module} from '@nestjs/common';
import { CacheService } from './cache.service';

@Module({
    imports: [
        CacheModule.register({
            isGlobal: true, // Rend le cache accessible partout
        }),
    ],
    providers: [CacheService],
    exports: [CacheService], // Pour pouvoir utiliser CacheService dans d'autres modules
})
export class CacheConfigModule { }
