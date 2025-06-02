import { ERole } from '@tousinclus/types';
import { UserDto } from 'src/users/dto/user.dto';

export interface CreateHelpers {
  user: UserDto;
}

export const createHelpers = ({ user }: CreateHelpers) => ({
  withRoles: (roles: ERole | ERole[], callback: () => void): void => {
    const rolesArray = Array.isArray(roles) ? roles : [roles];
    if (rolesArray.some((role) => user.roles.includes(role))) {
      callback();
    }
  },
});
