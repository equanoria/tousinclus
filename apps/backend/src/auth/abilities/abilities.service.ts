import {
  AbilityBuilder,
  createMongoAbility,
  MongoAbility,
} from '@casl/ability';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ABILITY_FACTORIES } from './constants';
import { EAction } from './types/Action';
import { SubjectClass } from '@casl/ability';
import { UserDto } from 'src/users/dto/user.dto';
import { DefineAbilities } from './types/Ability';
import { createHelpers } from './helpers';

type AppAbility = MongoAbility<[EAction, SubjectClass]>;

@Injectable()
export class AbilitiesService {
  private readonly logger = new Logger(AbilitiesService.name);

  constructor(
    @Inject(ABILITY_FACTORIES)
    private readonly abilityFactories: DefineAbilities[],
  ) {}

  buildForUser(user: UserDto): AppAbility {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility,
    );

    const helpers = createHelpers({ user });

    for (const factory of this.abilityFactories) {
      factory({ user, can, cannot, ...helpers });
    }

    return build();
  }
}
