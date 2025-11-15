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
import { AreasOfFocusService } from './areas-of-focus.service';
import { CreateAreaOfFocusDto } from './dto/create-area-of-focus.dto';
import { UpdateAreaOfFocusDto } from './dto/update-area-of-focus.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestUser } from '../auth/decorators/request-user.decorator';
import type { UserFromJwt } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('areas-of-focus')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('areas-of-focus')
export class AreasOfFocusController {
  constructor(private readonly areasOfFocusService: AreasOfFocusService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new area of focus' })
  @ApiResponse({
    status: 201,
    description: 'Area of focus created successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(
    @Body() createAreaOfFocusDto: CreateAreaOfFocusDto,
    @RequestUser() user: UserFromJwt,
  ) {
    return this.areasOfFocusService.create(createAreaOfFocusDto, user.id);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all areas of focus for the authenticated user',
  })
  @ApiResponse({ status: 200, description: 'List of areas of focus' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@RequestUser() user: UserFromJwt) {
    return this.areasOfFocusService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific area of focus by ID' })
  @ApiResponse({ status: 200, description: 'Area of focus found' })
  @ApiResponse({ status: 404, description: 'Area of focus not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string, @RequestUser() user: UserFromJwt) {
    return this.areasOfFocusService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an area of focus' })
  @ApiResponse({
    status: 200,
    description: 'Area of focus updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Area of focus not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(
    @Param('id') id: string,
    @Body() updateAreaOfFocusDto: UpdateAreaOfFocusDto,
    @RequestUser() user: UserFromJwt,
  ) {
    return this.areasOfFocusService.update(id, updateAreaOfFocusDto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an area of focus' })
  @ApiResponse({
    status: 200,
    description: 'Area of focus deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Area of focus not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string, @RequestUser() user: UserFromJwt) {
    return this.areasOfFocusService.remove(id, user.id);
  }
}
