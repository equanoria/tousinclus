import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomDto } from './create-room.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ERoomStatus } from '@tousinclus/types';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
  @IsOptional()
  @IsEnum(ERoomStatus)
  status: ERoomStatus;
}
