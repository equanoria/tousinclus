import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ABILITIES_KEY } from './abilities.decorator';
import { AbilityHandlerCallback } from './types/Ability';
import { AbilitiesService } from './abilities.service';

@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilitiesService: AbilitiesService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredAbilities = this.reflector.getAllAndOverride<
      AbilityHandlerCallback[]
    >(ABILITIES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredAbilities) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const ability = this.abilitiesService.createForUser(user);

    return requiredAbilities.every((handler) => handler(ability));
  }
}
