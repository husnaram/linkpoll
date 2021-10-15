import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { params, user } = context.switchToHttp().getRequest();
    // Check user is admin or does user resource belong to them
    if (user.isAdmin || user.id === +params.id) {
      return true;
    }

    return false;
  }
}
