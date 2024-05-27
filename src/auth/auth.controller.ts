import { Controller, Post, Body, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginResponseDto } from 'src/user/dto/loginResponse.dto';
import { LoginDto } from 'src/user/dto/loginDto.dto';
import { User } from 'src/user/entities/user.entity';
import { SignupDto } from 'src/user/dto/signupDto.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto): Promise<User> {
    return this.authService.signUp(signupDto);
  }

  @Put('login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }
}
