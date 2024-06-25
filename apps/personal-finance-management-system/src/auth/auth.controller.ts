import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../guards/local-auth.gurad';
import { LoginResponseDto } from '../user/dto/loginResponse.dto';
import { LoginBodyDto } from './dto/login-body-auth.dto';
import { UserType } from '../types/userType';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @Body() user: LoginBodyDto,
    @Req() req,
  ): Promise<LoginResponseDto> {
    console.log(req.user);
    const loginUser: UserType = { email: user.email, id: req.user.id };
    return this.authService.login(loginUser);
  }
}
