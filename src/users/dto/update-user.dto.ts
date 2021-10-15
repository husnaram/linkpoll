// import { PartialType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

// PartialType() from @nestjs/mapped-types cannot recognize Swagger UI
export class UpdateUserDto extends PartialType(CreateUserDto) {}
