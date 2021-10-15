import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class CreateAdminDto extends CreateUserDto {
  @ApiProperty()
  @IsBoolean()
  readonly is_admin: boolean;
}
