import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ABILITIES_KEY } from './abilities.decorator';
import { AppAbility } from './types/Ability';

@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredAbilities = this.reflector.getAllAndOverride<AppAbility[]>(
      ABILITIES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredAbilities) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return requiredAbilities.some((role) => user.roles?.includes(role));
  }
}
