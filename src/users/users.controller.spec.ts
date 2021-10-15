import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('User Controllers', () => {
  let controller: UsersController;

  const userFaker: CreateUserDto = {
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    profile_color: faker.internet.color(),
    avatar_filename: faker.internet.url(),
  };
  const mockUsersService = {
    create: jest.fn(() => {
      return UserEntity;
    }),
    createAdmin: jest.fn(() => {
      return UserEntity;
    }),
    findAll: jest.fn(() => {
      return new Array<UserEntity>();
    }),
    findOne: jest.fn(() => {
      return UserEntity;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Creating new user.', () => {
    it('Successful to create a user.', () => {
      expect(controller.create(userFaker)).toEqual(UserEntity);
    });

    it('Successful to create an admin.', () => {
      expect(controller.createAdmin({ ...userFaker, is_admin: true })).toEqual(
        UserEntity,
      );
    });
  });

  it('Get all users.', () => {
    expect(controller.findAll()).toEqual(new Array<UserEntity[]>());
  });

  it('Get a user.', () => {
    expect(controller.findOne('1')).toEqual(UserEntity);
  });
});
