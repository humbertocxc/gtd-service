import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoutineTemplate } from '../models/routine-template.entity';
import { CreateRoutineTemplateDto } from './dto/create-routine-template.dto';
import { UpdateRoutineTemplateDto } from './dto/update-routine-template.dto';

@Injectable()
export class RoutineTemplateService {
  constructor(
    @InjectRepository(RoutineTemplate)
    private readonly templateRepository: Repository<RoutineTemplate>,
  ) {}

  async create(
    userId: string,
    dto: CreateRoutineTemplateDto,
  ): Promise<RoutineTemplate> {
    const template = this.templateRepository.create({
      ...dto,
      userId,
    });
    return await this.templateRepository.save(template);
  }

  async findAll(userId: string): Promise<RoutineTemplate[]> {
    return await this.templateRepository.find({
      where: { userId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(userId: string, id: string): Promise<RoutineTemplate> {
    const template = await this.templateRepository.findOne({
      where: { id, userId },
      relations: ['items'],
    });
    if (!template) {
      throw new NotFoundException(`Routine template with ID ${id} not found`);
    }
    return template;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateRoutineTemplateDto,
  ): Promise<RoutineTemplate> {
    const template = await this.findOne(userId, id);
    Object.assign(template, dto);
    return await this.templateRepository.save(template);
  }

  async remove(userId: string, id: string): Promise<void> {
    const template = await this.findOne(userId, id);
    await this.templateRepository.softRemove(template);
  }
}
