import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AreaOfFocus } from '../models/area-of-focus.entity';
import { CreateAreaOfFocusDto } from './dto/create-area-of-focus.dto';
import { UpdateAreaOfFocusDto } from './dto/update-area-of-focus.dto';

@Injectable()
export class AreasOfFocusService {
  constructor(
    @InjectRepository(AreaOfFocus)
    private readonly areaOfFocusRepository: Repository<AreaOfFocus>,
  ) {}

  async create(
    createAreaOfFocusDto: CreateAreaOfFocusDto,
    userId: string,
  ): Promise<AreaOfFocus> {
    const areaOfFocus = this.areaOfFocusRepository.create({
      ...createAreaOfFocusDto,
      userId,
    });
    return await this.areaOfFocusRepository.save(areaOfFocus);
  }

  async findAll(userId: string): Promise<AreaOfFocus[]> {
    return await this.areaOfFocusRepository.find({
      where: { userId },
      relations: ['projects'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string, userId: string): Promise<AreaOfFocus> {
    const areaOfFocus = await this.areaOfFocusRepository.findOne({
      where: { id, userId },
      relations: ['projects'],
    });

    if (!areaOfFocus) {
      throw new NotFoundException(`Area of Focus with ID ${id} not found`);
    }

    return areaOfFocus;
  }

  async update(
    id: string,
    updateAreaOfFocusDto: UpdateAreaOfFocusDto,
    userId: string,
  ): Promise<AreaOfFocus> {
    const areaOfFocus = await this.findOne(id, userId);

    Object.assign(areaOfFocus, updateAreaOfFocusDto);
    return await this.areaOfFocusRepository.save(areaOfFocus);
  }

  async remove(id: string, userId: string): Promise<void> {
    const areaOfFocus = await this.findOne(id, userId);
    await this.areaOfFocusRepository.remove(areaOfFocus);
  }

  async verifyOwnership(id: string, userId: string): Promise<AreaOfFocus> {
    const areaOfFocus = await this.areaOfFocusRepository.findOne({
      where: { id },
    });

    if (!areaOfFocus) {
      throw new NotFoundException(`Area of Focus with ID ${id} not found`);
    }

    if (areaOfFocus.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this area of focus',
      );
    }

    return areaOfFocus;
  }
}
