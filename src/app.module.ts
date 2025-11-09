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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const entities = [];
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
