import { Inject, Injectable, Optional } from '@nestjs/common';
import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { UserDto } from 'src/users/dto/user.dto';
import { ABILITY_DEFINITIONS } from './constants';
import { AbilityDefinition, AppAbility } from './types/ability-definition';

@Injectable()
export class AbilityFactory {
  constructor(
    @Inject(ABILITY_DEFINITIONS)
    @Optional()
    private readonly definitions: AbilityDefinition[][] = [],
  ) {}

  createForUser(user: UserDto) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility,
    );

    for (const group of this.definitions) {
      for (const def of group) {
        def.define({ can, cannot, user });
      }
    }

    return build({
      detectSubjectType: (item) => item.constructor,
    });
  }
}
