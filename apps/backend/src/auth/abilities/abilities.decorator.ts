import { SetMetadata } from '@nestjs/common';
import { AppAbility } from './types/Ability';

export const ABILITIES_KEY = 'abilities';
export const Abilities = (...abilities: AppAbility[]) =>
  SetMetadata(ABILITIES_KEY, abilities);
