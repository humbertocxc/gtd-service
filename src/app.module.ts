import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module.js';
import { JwtStrategy } from './auth/strategies/jwt.strategy.js';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { InboxModule } from './inbox/inbox.module';
import { ActionsModule } from './actions/actions.module';
import { ContextsModule } from './contexts/contexts.module';
import { AreasOfFocusModule } from './areas-of-focus/areas-of-focus.module';
import { RoutineModule } from './routine/routine.module';
import { InboxItem } from './models/inbox-item.entity';
import { Action } from './models/action.entity';
import { Project } from './models/project.entity';
import { Context } from './models/context.entity';
import { AreaOfFocus } from './models/area-of-focus.entity';
import { ActivityLog } from './models/activity-log.entity';
import { RoutineTemplate } from '@routine/models/routine-template.entity';
import { RoutineItem } from '@routine/models/routine-item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const entities = [
          InboxItem,
          Action,
          Project,
          Context,
          AreaOfFocus,
          ActivityLog,
          RoutineTemplate,
          RoutineItem,
        ];
        const databaseUrl = configService.get<string>('DATABASE_URL');
        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            synchronize: configService.get('SYNCHRONIZE') === 'true',
            entities,
          };
        }
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST')!,
          port: +configService.get<string>('DB_PORT')!,
          username: configService.get<string>('DB_USERNAME')!,
          password: configService.get<string>('DB_PASSWORD')!,
          database: configService.get<string>('DB_DATABASE')!,
          synchronize: configService.get('SYNCHRONIZE') === 'true',
          entities,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    InboxModule,
    ActionsModule,
    ContextsModule,
    AreasOfFocusModule,
    RoutineModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
