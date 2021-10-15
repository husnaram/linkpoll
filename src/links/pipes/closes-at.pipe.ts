import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ScheduleTimeUnits } from 'src/common/enums/schedule-time-units.enum';
import { CreateLinkDto } from '../dto/create-link.dto';

@Injectable()
export class ClosesAtPipe implements PipeTransform {
  transform(value: CreateLinkDto, metadata: ArgumentMetadata) {
    const dateInputArr = value.closesAt.split(' ');
    const dateValue = parseInt(dateInputArr[0]);
    const unit = dateInputArr[1];

    if (dateValue <= 0) {
      throw new BadRequestException('closesAt field');
    }

    switch (unit) {
      case ScheduleTimeUnits.Day:
      case ScheduleTimeUnits.Hour:
      case ScheduleTimeUnits.Minute:
        break;
      default:
        throw new BadRequestException('closesAt field');
    }
    return value;
  }
}
