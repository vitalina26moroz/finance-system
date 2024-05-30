import { Controller, Put, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginResponseDto } from 'src/user/dto/loginResponse.dto';
import { LocalAuthGuard } from './guards/local-auth.gurad';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Put('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req): Promise<LoginResponseDto> {
    return this.authService.login(req.user);
  }
}
