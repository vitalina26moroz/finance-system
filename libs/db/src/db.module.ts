import { Module } from '@nestjs/common';
import { DbService } from './db.service';
import { User } from './entities/user.entity';
import { Category } from './entities/category.entity';
import { Transaction } from './entities/transaction.entity';
import { Report } from './entities/report.entity';
import { Analytics } from './entities/analytics.entity';

@Module({
  imports: [User, Category, Transaction, Report, Analytics],
  providers: [DbService],
  exports: [DbService, User, Category, Transaction, Report, Analytics],
})
export class DbModule {}
