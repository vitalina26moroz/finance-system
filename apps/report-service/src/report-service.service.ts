import { User } from '@app/db/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { Report } from '@app/db/entities/report.entity';
import { GenerateReportDto } from './dto/generateReport.dto';

@Injectable()
export class ReportService {
  constructor(
    private s3: S3,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  async generateReportLink(
    id: string,
    month: number,
    year: number,
  ): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        categories: true,
        transactions: true,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }
    console.log(user);

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const categoryTransactions = user.categories.map((category) => {
      const transactions = user.transactions.filter(
        (transaction) =>
          transaction.category.category_name === category.category_name &&
          transaction.createdAt < endDate &&
          transaction.createdAt >= startDate,
      );

      return {
        category: category.category_name,
        transactions: transactions.map((transaction) => ({
          id: transaction.id,
          amount: transaction.amount,
          date: transaction.createdAt,
          type: transaction.type,
        })),
      };
    });

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

  async generateReport(generateReportDto: GenerateReportDto) {
    const newReport = {
      link: '',
      year: generateReportDto.year,
      month: generateReportDto.month,
      status: 'inProgress',
      user: {
        id: generateReportDto.id,
      },
    };

    const report = await this.reportRepository.save(newReport);

    const link = await this.generateReportLink(
      generateReportDto.id,
      generateReportDto.month,
      generateReportDto.year,
    );

    return await this.reportRepository.update(report.id, {
      status: 'done',
      link: link,
    });
  }
}
