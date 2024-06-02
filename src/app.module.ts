import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ReportModule } from './report/report.module';
import { TransactionModule } from './transaction/transaction.module';
import { CategoryModule } from './category/category.module';

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
        entities: [__dirname + '/**/*.entity{.js, .ts}'],
        synchronize: false,
      }),
    }),
    UserModule,
    AuthModule,
    ReportModule,
    TransactionModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
