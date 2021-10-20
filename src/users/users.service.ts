import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { extname } from 'path';
import { Repository } from 'typeorm';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (!user) {
      const user = this.userRepository.create(createUserDto);

      return this.userRepository.save(user);
    }

    if (
      user.username === createUserDto.username &&
      user.email === createUserDto.email
    ) {
      throw new ConflictException(`Username and email has been used`);
    } else if (user.username === createUserDto.username) {
      throw new ConflictException(`Username has been used`);
    } else {
      throw new ConflictException(`Email has been used`);
    }
  }

  async createAdmin(createAdminDto: CreateAdminDto) {
    const admin = await this.userRepository.findOne({
      where: { username: createAdminDto.username },
    });
    if (!admin) {
      const admin = this.userRepository.create(createAdminDto);
      admin.isAdmin = true;

      return this.userRepository.save(admin);
    }

    if (
      admin.username === createAdminDto.username &&
      admin.email === createAdminDto.email
    ) {
      throw new ConflictException(`Username and email has been used`);
    } else if (admin.username === createAdminDto.username) {
      throw new ConflictException(`Username has been used`);
    } else {
      throw new ConflictException(`Email has been used`);
    }
  }

  findAll() {
    // TODO: add pagination
    return this.userRepository.find();
  }

  async findById(id: number) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id #${id} not found`);
    }

    return user;
  }

  async findAllUserLinks(id: number) {
    const user = await this.userRepository.findOne(id, {
      relations: ['links'],
    });
    if (!user) {
      throw new NotFoundException(`User with id #${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    if (!user) {
      throw new NotFoundException(`User email with ${email} not found`);
    }

    return user;
  }

  async findByUsername(username: string) {
    const user = await this.userRepository.findOne({
      where: { username },
    });
    if (!user) {
      throw new NotFoundException(`Username ${username} not found`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (!Boolean(Object.keys(updateUserDto).length)) {
      throw new BadRequestException('At least one field to updating.');
    }

    const user = await this.userRepository.update(id, updateUserDto);
    if (!user.affected) {
      throw new NotFoundException(`User with id #${id} not found`);
    }

    return;
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id #${id} not found`);
    }
    this.userRepository.remove(user);

    return;
  }

  static imageFileFilter(req, file, callback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return callback(new Error('Only image files are allowed!'), false);
    }

    callback(null, true);
  }

  static editFileName(req, file, callback) {
    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    const randomName = Array(4)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');

    callback(null, `${name}-${randomName}${fileExtName}`);
  }
}
