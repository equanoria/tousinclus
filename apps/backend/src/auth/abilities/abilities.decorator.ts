import { SetMetadata } from '@nestjs/common';
import { AbilityHandlerCallback } from './types/Ability';

export const ABILITIES_KEY = 'abilities';
export const Abilities = (...handlers: AbilityHandlerCallback[]) =>
  SetMetadata(ABILITIES_KEY, handlers);
