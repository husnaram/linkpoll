import { Test, TestingModule } from '@nestjs/testing';
import { LinkPollsService } from './link-polls.service';

describe('LinkPollsService', () => {
  let service: LinkPollsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LinkPollsService],
    }).compile();

    service = module.get<LinkPollsService>(LinkPollsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
