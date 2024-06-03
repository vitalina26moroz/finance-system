import { IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  currency: string;
  @IsOptional()
  password_hashed: string;
  @IsOptional()
  email: string;
  @IsOptional()
  name: string;
}
