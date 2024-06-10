import { IsNotEmpty, IsOptional } from 'class-validator';
import { User } from '@app/db/entities/user.entity';
export class CreateCategoryDto {
  @IsNotEmpty()
  category_name: string;
  @IsNotEmpty()
  user: User;
  @IsOptional()
  description: string;
  @IsNotEmpty()
  transaction_type: string;
}
