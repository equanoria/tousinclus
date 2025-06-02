import { AbilityBuilder, MongoAbility, Subject } from '@casl/ability';
import { EAction } from './action';
import { UserDto } from 'src/users/dto/user.dto';

export type AppAbility = MongoAbility<[EAction, Subject]>;

export type Ability = {
  can: (...args: Parameters<AppAbility['can']>) => boolean;
  cannot: (...args: Parameters<AppAbility['cannot']>) => boolean;
  user: UserDto;
};

export interface AbilityDefinition {
  define: (builder: AbilityBuilder<AppAbility>) => void;
  subjects: Subject[];
}
