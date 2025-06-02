import { Module, DynamicModule } from '@nestjs/common';
import { DefineAbilities } from './types/Ability';
import { ABILITY_FACTORIES } from './constants';

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
      ],
    };
  }
}
