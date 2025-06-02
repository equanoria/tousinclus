import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { ABILITY_DEFINITIONS } from './constants';
import { AbilityDefinition } from './types/ability-definition';
import { AbilityFactory } from './abilities.factory';

@Global()
@Module({})
// biome-ignore lint/complexity/noStaticOnlyClass: forfeature & forRoot
export class AbilityModule {
  static forFeature(definitions: AbilityDefinition[]): DynamicModule {
    const provider: Provider = {
      provide: ABILITY_DEFINITIONS,
      useValue: definitions,
    };

    return {
      module: AbilityModule,
      providers: [provider],
      exports: [provider],
    };
  }

  static forRoot(): DynamicModule {
    return {
      module: AbilityModule,
      providers: [AbilityFactory],
      exports: [AbilityFactory],
    };
  }
}
