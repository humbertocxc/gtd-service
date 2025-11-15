import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ContextsService } from './contexts.service';
import { CreateContextDto } from './dto/create-context.dto';
import { UpdateContextDto } from './dto/update-context.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestUser } from '../auth/decorators/request-user.decorator';
import type { UserFromJwt } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('contexts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('contexts')
export class ContextsController {
  constructor(private readonly contextsService: ContextsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new context' })
  @ApiResponse({ status: 201, description: 'Context created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(
    @Body() createContextDto: CreateContextDto,
    @RequestUser() user: UserFromJwt,
  ) {
    return this.contextsService.create(createContextDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all contexts for the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of contexts' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@RequestUser() user: UserFromJwt) {
    return this.contextsService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific context by ID' })
  @ApiResponse({ status: 200, description: 'Context found' })
  @ApiResponse({ status: 404, description: 'Context not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string, @RequestUser() user: UserFromJwt) {
    return this.contextsService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a context' })
  @ApiResponse({ status: 200, description: 'Context updated successfully' })
  @ApiResponse({ status: 404, description: 'Context not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(
    @Param('id') id: string,
    @Body() updateContextDto: UpdateContextDto,
    @RequestUser() user: UserFromJwt,
  ) {
    return this.contextsService.update(id, updateContextDto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a context' })
  @ApiResponse({ status: 200, description: 'Context deleted successfully' })
  @ApiResponse({ status: 404, description: 'Context not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string, @RequestUser() user: UserFromJwt) {
    return this.contextsService.remove(id, user.id);
  }
}
