import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { LinkEntity } from './entities/link.entity';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(LinkEntity)
    private readonly linkRepository: Repository<LinkEntity>,
    private readonly usersService: UsersService,
  ) {}

  async create(userId: number, createLinkDto: CreateLinkDto) {
    const user = await this.usersService.findById(userId);
    const link = this.linkRepository.create({
      link: createLinkDto.link,
      closesAt: createLinkDto.closesAt,
      user,
    });

    return this.linkRepository.save(link);
  }

  findAll() {
    return this.linkRepository.find({
      relations: ['user'],
    });
  }

  async findOne(id: number) {
    const link = await this.linkRepository.findOne(id, {
      relations: ['user'],
    });
    if (!link) {
      throw new NotFoundException(`Link with id #${id} not found`);
    }
    return link;
  }

  update(id: number, updateLinkDto: UpdateLinkDto) {
    if (!Boolean(Object.keys(updateLinkDto).length)) {
      throw new BadRequestException('At least one field to updating.');
    }

    const link = this.linkRepository.update(id, updateLinkDto);
    if (!link) {
      throw new NotFoundException(`Link with id #${id} not found`);
    }
    return;
  }

  async softRemove(id: number) {
    const link = await this.linkRepository.findOne(id);
    if (!link) {
      throw new NotFoundException(`Link with id #${id} not found`);
    }
    this.linkRepository.softRemove(link);
    return;
  }

  async remove(id: number) {
    const link = await this.linkRepository.findOne(id);
    if (!link) {
      throw new NotFoundException(`Link with id #${id} not found`);
    }
    this.linkRepository.remove(link);
    return;
  }
}
