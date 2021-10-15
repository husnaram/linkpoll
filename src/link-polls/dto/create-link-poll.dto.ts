import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateLinkPollDto {
  @ApiProperty()
  @IsNumber()
  linkId: number;
}
