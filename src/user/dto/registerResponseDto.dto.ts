export class RegisterResponseDto {
  token: string;
  id: string;
  name: string;
  email: string;
  password_hashed: string;
  createdAt: Date;
  currency: string;
  current_budget: number;
  salt: string;
}
