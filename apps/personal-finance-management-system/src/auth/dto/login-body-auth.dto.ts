import { IsNotEmpty } from 'class-validator';

export class LoginBodyDto {
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
}
