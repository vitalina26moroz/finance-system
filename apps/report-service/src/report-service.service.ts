import { User } from '@app/db/entities/user.entity';
import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

import { Report } from '@app/db/entities/report.entity';
import { GenerateReportDto } from './dto/generateReport.dto';

@Injectable()
export class ReportServiceService {
  constructor(
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
      relations: ['categories', 'transactions', 'transactions.category'],
    });
    if (!user) {
      throw new Error('User not found');
    }

    const ClientS3 = new S3Client({
      region: this.configService.getOrThrow('AWS_REGION'),
    });

    const currentDate = new Date();
    const startDate = new Date(year, month - 1, 0);
    let endDate = new Date(year, month + 1, 1);

    if (startDate > currentDate) {
      throw new BadRequestException('Future month data is not available');
    }

    if (
      endDate < currentDate &&
      endDate.getFullYear() === currentDate.getFullYear() &&
      endDate.getMonth() === currentDate.getMonth()
    ) {
      endDate = currentDate;
    }

    const categoryTransactions = user.categories.map((category) => {
      const transactions = user.transactions.filter((transaction) => {
        return (
          transaction.category.category_name === category.category_name &&
          transaction.createdAt < endDate &&
          transaction.createdAt > startDate
        );
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

    const reportJson = JSON.stringify(report);
    const key = `reports/${user.id}-report-${year}-${month}.json`;

    const s3Params = {
      Bucket: this.configService.getOrThrow('AWS_S3_BUCKET_NAME'),
      Key: key,
      Body: reportJson,
      ContentType: 'application/json',
    };

    const putObjectCommand = new PutObjectCommand(s3Params);

    try {
      await ClientS3.send(putObjectCommand);
    } catch (e) {
      throw new ServiceUnavailableException('Could not upload to s3');
    }

    const fileUrl = `https://${this.configService.getOrThrow('AWS_S3_BUCKET_NAME')}.s3.${this.configService.getOrThrow('AWS_REGION')}.amazonaws.com/${key}`;
    console.log(`File URL: ${fileUrl}`);

    return fileUrl;
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

    const existInDB = await this.reportRepository.findOne({
      where: {
        year: generateReportDto.year,
        user: { id: generateReportDto.id },
        month: generateReportDto.month,
      },
    });
    let reportId;
    let report;
    if (existInDB) {
      report = await this.reportRepository.update(existInDB.id, {
        status: 'inProgress',
      });
      reportId = existInDB.id;
    } else {
      report = await this.reportRepository.save(newReport);
      reportId = report.id;
    }

    const link = await this.generateReportLink(
      generateReportDto.id,
      generateReportDto.month,
      generateReportDto.year,
    );

    return await this.reportRepository.update(reportId, {
      status: 'done',
      link: link,
    });
  }
}
