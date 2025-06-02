import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ERole, IUser } from '@tousinclus/types';

export class UserDto implements IUser {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsEnum(ERole, { each: true })
  roles: ERole[];
}
