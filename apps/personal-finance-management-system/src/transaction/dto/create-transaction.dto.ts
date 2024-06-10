import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Category } from '../../../../../libs/db/src/entities/category.entity';
import { User } from '@app/db/entities/user.entity';

export class CreateTransactionDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  type: 'expense' | 'income';

  @IsNotEmpty()
  category: Category;

  @IsNotEmpty()
  user: User;

  @IsOptional()
  description: string;
}
