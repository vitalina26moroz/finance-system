export class RegisterResponseDto {
  token: string;
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  currency: string;
  current_budget: number;
  salt: string;
}
