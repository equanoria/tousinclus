import {
  AbilityBuilder,
  MongoAbility,
  MongoQuery,
  SubjectClass,
  SubjectRawRule,
} from '@casl/ability';
import { UserDto } from 'src/users/dto/user.dto';
import { EAction } from './Action';
import { ERole } from '@tousinclus/types';

export type Rule = SubjectRawRule<EAction, SubjectClass, MongoQuery>;

export type DefineAbilities = (options: {
  user: UserDto;
  can: AbilityBuilder<MongoAbility<[EAction, SubjectClass]>>['can'];
  cannot: AbilityBuilder<MongoAbility<[EAction, SubjectClass]>>['cannot'];
  withRoles: (role: ERole | ERole[], callBack: () => void) => void;
}) => void;
