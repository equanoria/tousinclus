import { Controller, UseGuards } from '@nestjs/common';
import { Abilities } from 'src/auth/abilities/abilities.decorator';
import { AbilitiesGuard } from 'src/auth/abilities/abilities.guard';
import { EAction } from 'src/auth/abilities/types/Action';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoomDocument } from './schemas/room.schema';

@UseGuards(AuthGuard, AbilitiesGuard)
@Abilities((ability) => ability.can(EAction.MANAGE, RoomDocument))
@Controller('rooms')
export class RoomsController {}
