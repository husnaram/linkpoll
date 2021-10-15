import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import * as dayjs from 'dayjs';
import { LinksService } from './links.service';

@Injectable()
export class LinksClosesScheduleService {
  constructor(
    private readonly linksService: LinksService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  scheduleCloseLink(linkId: number, closesAt: string) {
    const scheduleKey = `Link id #${linkId}`;
    const dateInputArr = closesAt.split(' ');
    const value = parseInt(dateInputArr[0]);
    const unit = dateInputArr[1];

    const dateInput = new Date(dayjs().add(value, unit).format());
    const job = new CronJob(dateInput, async () => {
      if (this.schedulerRegistry.doesExists('timeout', scheduleKey)) {
        this.linksService.remove(linkId);
        return;
      }
      return;
    });

    this.schedulerRegistry.addTimeout(scheduleKey, job);
    job.start();
  }
}
