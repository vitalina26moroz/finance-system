import { User } from '@app/db/entities/user.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { Repository } from 'typeorm';
import { GenerateAnalyticsDto } from './dto/generateAnalytics.dto';
import { Analytics } from '@app/db/entities/analytics.entity';
import { CategoryAmount } from './types/category-amount';
import { HighestDay } from './types/highestDay';
import { MainSource } from './types/mainSource';

@Injectable()
export class AnalyticsServiceService {
  constructor(
    private s3: S3,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Analytics)
    private readonly analyticsRepository: Repository<Analytics>,
  ) {}

  calculateDaysBetweenDates(startDate: Date, endDate: Date) {
    const differenceInMilliseconds = endDate.getTime() - startDate.getTime();
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const differenceInDays = Math.round(
      differenceInMilliseconds / millisecondsPerDay,
    );

    return differenceInDays;
  }

  async generateAnalyticsLink(
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

    const currentDate = new Date();
    const startDate = new Date(year, month, 1);
    let endDate = new Date(year, month + 1, 0);

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

    const daysPeriod = this.calculateDaysBetweenDates(startDate, endDate);

    let incomeCategoriesAmounts: CategoryAmount[];
    let expenseCategoriesAmounts: CategoryAmount[];

    let total_expense: number = 0;
    let total_income: number = 0;

    let highest_spending_day: HighestDay = {
      date: startDate,
      amount: 0,
    };
    let highest_income_day: HighestDay = {
      date: startDate,
      amount: 0,
    };
    let main_income_source: MainSource = { category_name: '', amount: 0 };
    let main_expense_source: MainSource = { category_name: '', amount: 0 };

    const incomeCategories = user.categories.filter(
      (category) => (category.transaction_type = 'income'),
    );

    const expenseCategories = user.categories.filter(
      (category) => (category.transaction_type = 'expense'),
    );

    const incomeCategoriesTransactions = incomeCategories.map((category) => {
      const transactions = user.transactions.filter(
        (transaction) =>
          transaction.category.category_name === category.category_name &&
          transaction.createdAt < endDate &&
          transaction.createdAt >= startDate,
      );

      incomeCategoriesAmounts.push({
        category_name: category.category_name,
        amount: 0,
      });

      transactions.forEach((transaction) => {
        total_income = total_income + transaction.amount;
        incomeCategoriesAmounts[incomeCategoriesAmounts.length - 1].amount +=
          transaction.amount;
        if (highest_income_day.amount < transaction.amount) {
          highest_income_day = {
            amount: transaction.amount,
            date: transaction.createdAt,
          };
        }
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

    const expenseCategoriesTransactions = expenseCategories.map((category) => {
      const transactions = user.transactions.filter(
        (transaction) =>
          transaction.category.category_name === category.category_name &&
          transaction.createdAt < endDate &&
          transaction.createdAt >= startDate,
      );

      expenseCategoriesAmounts.push({
        category_name: category.category_name,
        amount: 0,
      });

      transactions.forEach((transaction) => {
        total_expense = total_expense + transaction.amount;
        expenseCategoriesAmounts[expenseCategoriesAmounts.length - 1].amount +=
          transaction.amount;
        if (highest_spending_day.amount < transaction.amount) {
          highest_spending_day = {
            amount: transaction.amount,
            date: transaction.createdAt,
          };
        }
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

    incomeCategoriesAmounts.forEach((incomeCategoriesAmount) => {
      if (incomeCategoriesAmount.amount > main_income_source.amount) {
        main_income_source = { ...incomeCategoriesAmount };
      }
    });

    expenseCategoriesAmounts.forEach((expenseCategoriesAmount) => {
      if (expenseCategoriesAmount.amount > main_expense_source.amount) {
        main_expense_source = { ...expenseCategoriesAmount };
      }
    });

    const analytics = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      period: {
        month,
        year,
      },
      total_income: total_income,
      total_expense: total_expense,
      variance: total_income - total_expense,
      average_daily_spending: total_expense / daysPeriod,
      average_daily_income: total_income / daysPeriod,
      highest_spending_day: highest_spending_day,
      highest_income_day: highest_income_day,
      main_income_source: main_income_source,
      main_expense_source: main_expense_source,
      income: incomeCategoriesTransactions,
      expense: expenseCategoriesTransactions,
    };

    const reportJson = JSON.stringify(analytics, null, 2);

    const s3Params = {
      Bucket: this.configService.getOrThrow('AWS_S3_BUCKET_NAME'),
      Key: `reports/${user.id}-report-${year}-${month}.json`,
      Body: reportJson,
      ContentType: 'application/json',
    };

    const uploadResult = await this.s3.upload(s3Params).promise();

    return uploadResult.Location;
  }

  async generateAnalytics(generateAnalyticsDto: GenerateAnalyticsDto) {
    const newAnalytics = {
      link: '',
      year: generateAnalyticsDto.year,
      month: generateAnalyticsDto.month,
      status: 'inProgress',
      user: {
        id: generateAnalyticsDto.id,
      },
    };

    const analytics = await this.analyticsRepository.save(newAnalytics);

    const link = await this.generateAnalyticsLink(
      generateAnalyticsDto.id,
      generateAnalyticsDto.month,
      generateAnalyticsDto.year,
    );

    return await this.analyticsRepository.update(analytics.id, {
      status: 'done',
      link: link,
    });
  }
}
