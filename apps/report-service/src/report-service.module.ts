import { Module } from '@nestjs/common';
import { ReportServiceController } from './report-service.controller';
import { ReportService } from './report-service.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/db/entities/user.entity';
import { Transaction } from '@app/db/entities/transaction.entity';
import { Analytics } from '@app/db/entities/analytics.entity';
import { Category } from '@app/db/entities/category.entity';
import { Report } from '@app/db/entities/report.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow('HOST'),
        port: configService.getOrThrow('PORT'),
        username: configService.getOrThrow('DBUSER'),
        password: configService.getOrThrow('PASSWORD'),
        database: configService.getOrThrow('NAME'),
        entities: [User, Transaction, Report, Analytics, Category],
        synchronize: false,
      }),
    }),
  ],
  controllers: [ReportServiceController],
  providers: [ReportService],
})
export class ReportServiceModule {}
