import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { LinksService } from '../links.service';

@Injectable()
export class LinkOwnerAndAdminGuard implements CanActivate {
  constructor(private readonly linksService: LinksService) {}

  async canActivate(context: ExecutionContext) {
    const { params, user } = context.switchToHttp().getRequest();
    const linkEntity = await this.linksService.findOne(+params.id);
    if (user.isAdmin || user.id === linkEntity.user.id) {
      return true;
    }

    throw new ForbiddenException('Have not permission to this resource');
  }
}
