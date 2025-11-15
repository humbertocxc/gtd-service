import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { DailyRoutineInstance } from '@routine/models/daily-routine-instance.entity';
import { RoutineGTDConversionEvent } from '../models/routine-gtd-conversion-event.entity';
import { Action } from '@models/action.entity';
import { ActionStatus } from '@models/action-status.enum';
import { ConvertToActionDto } from './dto/convert-to-action.dto';

@Injectable()
export class RoutineConversionService {
  constructor(
    @InjectRepository(DailyRoutineInstance)
    private readonly instanceRepository: Repository<DailyRoutineInstance>,
    @InjectRepository(RoutineGTDConversionEvent)
    private readonly conversionRepository: Repository<RoutineGTDConversionEvent>,
    @InjectRepository(Action)
    private readonly actionRepository: Repository<Action>,
    private readonly dataSource: DataSource,
  ) {}

  async convertToAction(
    userId: string,
    dto: ConvertToActionDto,
  ): Promise<{ instance: DailyRoutineInstance; action: Action }> {
    // Validate instance exists and belongs to user
    const instance = await this.instanceRepository.findOne({
      where: { id: dto.instanceId, userId },
      relations: ['planEntry', 'planEntry.routineItem'],
    });

    if (!instance) {
      throw new NotFoundException(
        `Daily routine instance with ID ${dto.instanceId} not found`,
      );
    }

    if (instance.convertedToAction) {
      throw new BadRequestException(
        'Instance has already been converted to an action',
      );
    }

    // Transaction to ensure atomicity
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create GTD Action
      const action = this.actionRepository.create({
        userId,
        description: `${instance.title}${instance.description ? ': ' + instance.description : ''}`,
        status: ActionStatus.NEXT,
      });
      const savedAction = await queryRunner.manager.save(action);

      // Mark instance as converted
      instance.convertedToAction = true;
      await queryRunner.manager.save(instance);

      // Create conversion event
      const conversionEvent = this.conversionRepository.create({
        userId,
        instanceId: instance.id,
        gtdActionId: savedAction.id,
        convertedAt: new Date(),
        conversionNotes: dto.conversionNotes,
      });
      await queryRunner.manager.save(conversionEvent);

      await queryRunner.commitTransaction();

      return { instance, action: savedAction };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findConversionHistory(
    userId: string,
  ): Promise<RoutineGTDConversionEvent[]> {
    return await this.conversionRepository.find({
      where: { userId },
      relations: ['instance'],
      order: { convertedAt: 'DESC' },
    });
  }
}
