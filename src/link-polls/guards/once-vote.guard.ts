import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { LinkPollsService } from 'src/link-polls/link-polls.service';

@Injectable()
export class OnceVoteGuard implements CanActivate {
  constructor(private readonly linkPollsService: LinkPollsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { body, user } = context.switchToHttp().getRequest();

    return this.linkPollsService.checkDuplicateUser(body.linkId, user.id);
  }
}
