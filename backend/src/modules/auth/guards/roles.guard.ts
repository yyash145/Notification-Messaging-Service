import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
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

    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (!roles.includes(user.role)) {
      throw new RoleForbiddenException(roles);
    }

    return true;
  }
}


export class RoleForbiddenException extends ForbiddenException {
  constructor(requiredRoles: string[]) {
    super(`Access denied. Required role(s): ${requiredRoles.join(', ')}`);
  }
}