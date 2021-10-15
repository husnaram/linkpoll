import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class CreateLinkDto {
  @ApiProperty()
  @IsUrl()
  link: string;

  @ApiProperty()
  @IsString()
  closesAt: string;
}
