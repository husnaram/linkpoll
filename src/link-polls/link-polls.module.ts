import { Module } from '@nestjs/common';
import { LinkPollsService } from './link-polls.service';
import { LinkPollsController } from './link-polls.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkPollEntity } from './entities/link-poll.entity';
import { LinksModule } from 'src/links/links.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    UsersModule,
    LinksModule,
    TypeOrmModule.forFeature([LinkPollEntity]),
  ],
  controllers: [LinkPollsController],
  providers: [LinkPollsService],
})
export class LinkPollsModule {}
