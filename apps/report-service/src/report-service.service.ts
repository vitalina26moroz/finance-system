import { Report } from '@app/db/entities/report.entity';
import { Transaction } from '@app/db/entities/transaction.entity';
import { User } from '@app/db/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { Category } from '@app/db/entities/category.entity';

@Injectable()
export class ReportServiceService {
  constructor(
    private s3: S3,
    private readonly configService: ConfigService,
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async generateReportLink(
    id: string,
    month: number,
    year: number,
  ): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const categories = await this.categoryRepository.find({
      where: {
        user: { id },
      },
      relations: {
        transactions: true,
      },
    });

    const categoryTransactions = await Promise.all(
      categories.map(async (category) => {
        const transactions = await this.transactionRepository.find({
          where: {
            user: { id },
            category: category,
            createdAt: Between(startDate, endDate),
          },
        });

        return {
          category: category.category_name,
          transactions: transactions.map((transaction) => ({
            id: transaction.id,
            amount: transaction.amount,
            date: transaction.createdAt,
            type: transaction.type,
          })),
        };
      }),
    );

    const report = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      period: {
        month,
        year,
      },
      categories: categoryTransactions,
    };

    const reportJson = JSON.stringify(report, null, 2);

    const s3Params = {
      Bucket: this.configService.getOrThrow('AWS_S3_BUCKET_NAME'),
      Key: `reports/${user.id}-report-${year}-${month}.json`,
      Body: reportJson,
      ContentType: 'application/json',
    };

    const uploadResult = await this.s3.upload(s3Params).promise();

    return uploadResult.Location;
  }
}
