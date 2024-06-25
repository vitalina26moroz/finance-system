import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}
export class CreateCategoryDto {
  @IsNotEmpty()
  category_name: string;
  @IsOptional()
  description: string;
  @IsNotEmpty()
  @IsEnum(TransactionType)
  transaction_type: TransactionType;
}
