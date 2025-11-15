import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContextsController } from './contexts.controller';
import { ContextsService } from './contexts.service';
import { Context } from '../entities/context.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Context])],
  controllers: [ContextsController],
  providers: [ContextsService],
  exports: [ContextsService],
})
export class ContextsModule {}
