import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LinkPollsService } from './link-polls.service';
import { CreateLinkPollDto } from './dto/create-link-poll.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OwnerNotAllowedPollGuard } from './guards/owner-not-allowed-poll.guard';
import { OnceVoteGuard } from './guards/once-vote.guard';
import { AdminPollGuard } from '../link-polls/guards/admin-poll.guard';

@ApiTags('Poll')
@Controller('link-polls')
export class LinkPollsController {
  constructor(private readonly linkPollsService: LinkPollsService) {}

  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Link has been successfully created.',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number' },
        status: { type: 'string' },
        data: { type: 'object' },
      },
      example: {
        code: 200,
        status: 'success',
        data: {
          id: 3,
          deleted_at: null,
          created_at: '2021-10-14T11:37:31.279Z',
          updated_at: '2021-10-14T11:37:31.279Z',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Link not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        error: { type: 'string' },
      },
      example: {
        statusCode: 404,
        message: 'Link with id #14 not found',
        error: 'Not Found',
      },
    },
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
        message: 'Required linkid.',
        error: 'Bad Request',
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'Link owner cannot vote.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        error: { type: 'string' },
      },
      example: {
        statusCode: 403,
        message: 'Have not permission to this resource',
        error: 'Forbidden',
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'User cannot vote twice.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        error: { type: 'string' },
      },
      example: {
        statusCode: 403,
        message: 'Have not permission to this resource',
        error: 'Forbidden',
      },
    },
  })
  @UseGuards(JwtAuthGuard, OwnerNotAllowedPollGuard, OnceVoteGuard)
  @Post()
  vote(@Body() createLinkPollDto: CreateLinkPollDto, @Request() req: any) {
    return this.linkPollsService.create(req.user.id, createLinkPollDto.linkId);
  }

  @ApiOkResponse({
    description: 'Getting all poll.',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number' },
        status: { type: 'string' },
        data: { type: 'array' },
      },
      example: {
        code: 200,
        status: 'success',
        data: [
          {
            id: 3,
            deleted_at: null,
            created_at: '2021-10-14T11:37:31.279Z',
            updated_at: '2021-10-14T11:37:31.279Z',
          },
        ],
      },
    },
  })
  @Get()
  findAll() {
    return this.linkPollsService.findAll();
  }

  @ApiOkResponse({
    description: 'Get single poll.',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number' },
        status: { type: 'string' },
        data: { type: 'object' },
      },
      example: {
        code: 200,
        status: 'success',
        data: {
          id: 3,
          created_at: '2021-10-14T11:37:31.279Z',
          updated_at: '2021-10-14T11:37:31.279Z',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Link not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        error: { type: 'string' },
      },
      example: {
        statusCode: 404,
        message: 'Link poll with id #14 not found',
        error: 'Not Found',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Appear when user put non-number to param',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        error: { type: 'string' },
      },
      example: {
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
        error: 'Bad Request',
      },
    },
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.linkPollsService.findOne(+id);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Delete poll success.',
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
  @ApiBadRequestResponse({
    description: 'Appear when user put non-number to param',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        error: { type: 'string' },
      },
      example: {
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
        error: 'Bad Request',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Link not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        error: { type: 'string' },
      },
      example: {
        statusCode: 404,
        message: 'Link poll with id #14 not found',
        error: 'Not Found',
      },
    },
  })
  @UseGuards(JwtAuthGuard, AdminPollGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.linkPollsService.remove(+id);
  }
}
