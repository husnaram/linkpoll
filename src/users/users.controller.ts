import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminGuard } from './guards/admin.guard';
import { UserEntity } from './entities/user.entity';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiCreatedResponseSchema } from '../common/swagger-api-schemas/api-created-response.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiCreatedResponse(ApiCreatedResponseSchema('New user success created.'))
  @ApiBadRequestResponse({
    description: 'Required field not filled.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        error: { type: 'string' },
      },
      example: {
        statusCode: 400,
        message: [
          'email must be an email',
          'password must contain only letters and numbers',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiConflictResponse({
    description: 'Conflict field on one or both of them.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        error: { type: 'string' },
      },
      example: {
        statusCode: 409,
        message: 'Username has been used',
        error: 'Conflict',
      },
    },
  })
  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiCreatedResponse({
    type: UserEntity,
    description: 'The record has been successfully created.',
  })
  @ApiBadRequestResponse({
    description: 'Required field not filled.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        error: { type: 'string' },
      },
      example: {
        statusCode: 400,
        message: [
          'email must be an email',
          'password must contain only letters and numbers',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiConflictResponse({
    description: 'Conflict field on one or both of them.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        error: { type: 'string' },
      },
      example: {
        statusCode: 409,
        message: 'Username has been used',
        error: 'Conflict',
      },
    },
  })
  @Post('admin/register')
  createAdmin(@Body() createAdminDto: CreateAdminDto) {
    // TODO: include token with expires to validation that the user is legitimate
    return this.usersService.createAdmin(createAdminDto);
  }

  @ApiOkResponse({ type: UserEntity, isArray: true })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOkResponse({ type: UserEntity })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        error: { type: 'string' },
      },
      example: {
        statusCode: 404,
        message: 'User with id #213 not found',
        error: 'Not Found',
      },
    },
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(+id);
  }

  @ApiOkResponse({ type: UserEntity })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        error: { type: 'string' },
      },
      example: {
        statusCode: 404,
        message: 'User with id #213 not found',
        error: 'Not Found',
      },
    },
  })
  @Get(':id/links')
  findAllUserLinks(@Param('id') id: string) {
    return this.usersService.findAllUserLinks(+id);
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Trying to update without JWT token.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
      },
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiOkResponse({
    description: 'Updating success.',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number' },
        status: { type: 'string' },
      },
      example: {
        code: 200,
        status: 'success',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User Not Found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        error: { type: 'string' },
      },
      example: {
        statusCode: 404,
        message: 'User with id #213 not found',
        error: 'Not Found',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Required at least one field to filled.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        error: { type: 'string' },
      },
      example: {
        statusCode: 400,
        message: 'At least one field to updating.',
        error: 'Bad Request',
      },
    },
  })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Trying to delete without JWT token.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
      },
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiOkResponse({
    description: 'Deleting success.',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number' },
        status: { type: 'string' },
      },
      example: {
        code: 200,
        status: 'success',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        error: { type: 'string' },
      },
      example: {
        statusCode: 404,
        message: 'User with id #213 not found',
        error: 'Not Found',
      },
    },
  })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: UsersService.editFileName,
    }),
    fileFilter: UsersService.imageFileFilter,
  }))
  uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    const response = {
      origin_filename: file.originalname,
      filename: file.filename,
    };

    return response;
  }
}
