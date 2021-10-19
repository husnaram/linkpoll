import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsAlphanumeric, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  readonly username: string;

  @ApiProperty()
  @IsAlphanumeric()
  readonly password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly profile_color: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly avatar_filename: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly currentHashedRefreshToken?: string;
}
