import { PartialType } from '@nestjs/mapped-types';
import { CreateLinkPollDto } from './create-link-poll.dto';

export class UpdateLinkPollDto extends PartialType(CreateLinkPollDto) {}
