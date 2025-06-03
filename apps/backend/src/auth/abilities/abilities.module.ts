import { Module, DynamicModule } from '@nestjs/common';
import { DefineAbilities } from './types/Ability';
import { ABILITY_FACTORIES } from './constants';
import { AbilitiesGuard } from './abilities.guard';
import { AbilitiesService } from './abilities.service';

@Module({})
export class AbilitiesModule {
  static forFeature(...abilityFactories: DefineAbilities[]): DynamicModule {
    return {
      module: AbilitiesModule,
      providers: [
        {
          provide: ABILITY_FACTORIES,
          useValue: abilityFactories,
        },
        AbilitiesService,
        AbilitiesGuard,
      ],
      exports: [AbilitiesService, AbilitiesGuard],
    };
  }
}
