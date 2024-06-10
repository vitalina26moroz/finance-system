import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth-guard';
import { LocalAuthGuard } from '../guards/local-auth.gurad';
import { LoginResponseDto } from '../user/dto/loginResponse.dto';
import { User } from '@app/db/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Body() user: User): Promise<LoginResponseDto> {
    return this.authService.login(user);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getUserInfo() {
    return {};
  }
}
