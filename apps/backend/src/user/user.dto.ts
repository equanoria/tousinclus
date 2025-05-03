import { IUser, TRole } from '@tousinclus/types';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class UserDto implements IUser {
  @IsOptional()
  id?: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(TRole)
  roles: TRole[];
}
