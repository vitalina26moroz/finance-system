import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { User } from './libs/db/src/entities/user.entity';
import { Transaction } from './libs/db/src/entities/transaction.entity';
import { Report } from './libs/db/src/entities/report.entity';
import { Analytics } from './libs/db/src/entities/analytics.entity';
import { Category } from './libs/db/src/entities/category.entity';
import { join } from 'path';
config();
const configService = new ConfigService();
export default new DataSource({
  type: 'postgres',
  host: configService.getOrThrow('HOST'),
  port: configService.getOrThrow('PORT'),
  username: configService.getOrThrow('DBUSER'),
  password: configService.getOrThrow('PASSWORD'),
  database: configService.getOrThrow('NAME'),
  entities: [User, Transaction, Report, Analytics, Category],
  migrations: [join(__dirname, 'libs/db/src/migrations/*{.ts,.js}')],
});
