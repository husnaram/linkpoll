import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LinkOwnerAndAdminGuard } from './guards/link-owner-and-admin.guard';
import { CreateLinkDto } from './dto/create-link.dto';
import { LinksService } from './links.service';
import { LinksClosesScheduleService } from './links-closes-schedule.service';
import { ClosesAtPipe } from './pipes/closes-at.pipe';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LinkEntity } from './entities/link.entity';

@ApiTags('Link')
@Controller('links')
export class LinksController {
  constructor(
    private readonly linksService: LinksService,
    private readonly linksClosesSchedule: LinksClosesScheduleService,
  ) {}

  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: LinkEntity,
    description: 'Link has been successfully created.',
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
        message: ['link must be an URL address', 'closesAt must be a string'],
        error: 'Bad Request',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'User trying to add link without JWT token.',
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
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body(ClosesAtPipe) createLinkDto: CreateLinkDto,
    @Request() req: any,
  ) {
    const link = await this.linksService.create(req.user.id, createLinkDto);
    this.linksClosesSchedule.scheduleCloseLink(link.id, createLinkDto.closesAt);

    return link;
  }

  @ApiOkResponse({ type: LinkEntity, isArray: true })
  @Get()
  findAll() {
    return this.linksService.findAll();
  }

  @ApiOkResponse({ type: LinkEntity })
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
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.linksService.findOne(id);
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
        message: 'Link with id #213 not found',
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
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLinkDto: CreateLinkDto) {
    return this.linksService.update(+id, updateLinkDto);
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
    description: 'Link not found.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        error: { type: 'string' },
      },
      example: {
        statusCode: 404,
        message: 'Link with id #213 not found',
        error: 'Not Found',
      },
    },
  })
  @UseGuards(JwtAuthGuard, LinkOwnerAndAdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.linksService.remove(+id);
  }
}
