import { Module } from '@nestjs/common';
import { Pool } from 'pg';

import { ConfigModule, ConfigService } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule,

    // ✅ TYPEORM
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (config: ConfigService) => ({
        type: 'postgres',

        host: config.get<string>('DATABASE_HOST'),

        port: Number(config.get<string>('DATABASE_PORT')),

        username: config.get<string>('DATABASE_USER'),

        password: config.get<string>('DATABASE_PASSWORD'),

        database: config.get<string>('DATABASE_NAME'),

        autoLoadEntities: true,

        synchronize: true,
      }),
    }),
  ],

  providers: [
    // ✅ PG SIMPLE
    {
      provide: 'PG_POOL',

      inject: [ConfigService],

      useFactory: (config: ConfigService) => {
        return new Pool({
          user: config.get<string>('DATABASE_USER'),

          password: config.get<string>('DATABASE_PASSWORD'),

          host: config.get<string>('DATABASE_HOST'),

          port: Number(config.get<string>('DATABASE_PORT')),

          database: config.get<string>('DATABASE_NAME'),
        });
      },
    },
  ],

  exports: [
    'PG_POOL',

    TypeOrmModule,
  ],
})
export class DatabaseModule {}