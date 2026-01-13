import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

const ROLES_KEY = 'roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>(
      ROLES_KEY,
      ctx.getHandler(),
    );
    if (!roles) return true;

    const { user } = ctx.switchToHttp().getRequest();
    return roles.includes(user.role);
  }
}
