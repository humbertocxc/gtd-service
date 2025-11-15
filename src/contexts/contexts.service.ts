import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Context } from '../entities/context.entity';
import { CreateContextDto } from './dto/create-context.dto';
import { UpdateContextDto } from './dto/update-context.dto';

@Injectable()
export class ContextsService {
  constructor(
    @InjectRepository(Context)
    private readonly contextRepository: Repository<Context>,
  ) {}

  async create(
    createContextDto: CreateContextDto,
    userId: string,
  ): Promise<Context> {
    const context = this.contextRepository.create({
      ...createContextDto,
      userId,
    });
    return await this.contextRepository.save(context);
  }

  async findAll(userId: string): Promise<Context[]> {
    return await this.contextRepository.find({
      where: { userId },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Context> {
    const context = await this.contextRepository.findOne({
      where: { id, userId },
    });

    if (!context) {
      throw new NotFoundException(`Context with ID ${id} not found`);
    }

    return context;
  }

  async update(
    id: string,
    updateContextDto: UpdateContextDto,
    userId: string,
  ): Promise<Context> {
    const context = await this.findOne(id, userId);

    Object.assign(context, updateContextDto);
    return await this.contextRepository.save(context);
  }

  async remove(id: string, userId: string): Promise<void> {
    const context = await this.findOne(id, userId);
    await this.contextRepository.remove(context);
  }

  private async verifyOwnership(id: string, userId: string): Promise<Context> {
    const context = await this.contextRepository.findOne({
      where: { id },
    });

    if (!context) {
      throw new NotFoundException(`Context with ID ${id} not found`);
    }

    if (context.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this context',
      );
    }

    return context;
  }
}
