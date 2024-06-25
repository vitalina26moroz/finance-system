import { IsString, MinLength } from 'class-validator';

export class SignupDto {
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  name: string;
}
