import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkEntity } from './entities/link.entity';
import { LinksService } from './links.service';
import { LinksController } from './links.controller';
import { UsersModule } from 'src/users/users.module';
import { LinksClosesScheduleService } from './links-closes-schedule.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    UsersModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([LinkEntity]),
  ],
  providers: [LinksService, LinksClosesScheduleService],
  controllers: [LinksController],
  exports: [LinksService],
})
export class LinksModule {}
