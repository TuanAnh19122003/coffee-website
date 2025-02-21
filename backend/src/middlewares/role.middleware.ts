import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class RoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.session.user;

    if (!user || user.role.name !== 'Admin') {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
