import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LinksService } from '../links/links.service';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { LinkPollEntity } from './entities/link-poll.entity';

@Injectable()
export class LinkPollsService {
  constructor(
    @InjectRepository(LinkPollEntity)
    private readonly linkPollsRepository: Repository<LinkPollEntity>,
    private readonly usersService: UsersService,
    private readonly linksService: LinksService,
  ) {}

  async create(userId: number, linkId: number) {
    const user = await this.usersService.findById(userId);
    const link = await this.linksService.findOne(linkId);
    if (!link) {
      throw new NotFoundException(`Poll with id #${linkId} not found`);
    }

    const poll = this.linkPollsRepository.create({
      link,
      user,
    });

    return this.linkPollsRepository.save(poll);
  }

  async findAll() {
    const polls = await this.linkPollsRepository.find({
      relations: ['user', 'link'],
    });

    return polls;
  }

  async findOne(id: number) {
    const poll = await this.linkPollsRepository.findOne(id, {
      relations: ['user', 'link'],
    });
    if (!poll) {
      throw new NotFoundException(`Poll with id #${id} not found`);
    }
    return poll;
  }

  async remove(id: number) {
    const link = await this.linkPollsRepository.findOne(id);
    if (!link) {
      throw new NotFoundException(`Link poll with id #${id} not found`);
    }
    this.linkPollsRepository.remove(link);
    return;
  }

  async checkDuplicateUser(linkId: number, userId: number) {
    const [, length] = await this.linkPollsRepository.findAndCount({
      relations: ['link', 'user'],
      where: {
        user: { id: userId },
        link: { id: linkId },
      },
    });
    if (length > 0) {
      throw new ForbiddenException('Have not permission to this resource');
    }

    return true;
  }
}
