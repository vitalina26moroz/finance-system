import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateTransactionDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  description: string;
}
