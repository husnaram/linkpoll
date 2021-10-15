import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { LinksService } from 'src/links/links.service';

@Injectable()
export class OwnerNotAllowedPollGuard implements CanActivate {
  constructor(private readonly linksService: LinksService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { body, user } = context.switchToHttp().getRequest();
    if (!Boolean(Object.keys(body).length)) {
      throw new BadRequestException('Required linkid.');
    }

    const link = await this.linksService.findOne(body.linkId);
    if (user.id !== link.user.id) {
      return true;
    }

    throw new ForbiddenException('Have not permission to this resource');
  }
}
