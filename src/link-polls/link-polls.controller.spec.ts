import { Test, TestingModule } from '@nestjs/testing';
import { LinkPollsController } from './link-polls.controller';
import { LinkPollsService } from './link-polls.service';

describe('LinkPollsController', () => {
  let controller: LinkPollsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LinkPollsController],
      providers: [LinkPollsService],
    }).compile();

    controller = module.get<LinkPollsController>(LinkPollsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
