import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/user/dto/loginDto.dto';
import { LoginResponseDto } from 'src/user/dto/loginResponse.dto';
import { SignupDto } from 'src/user/dto/signupDto.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUserById(userId: string) {
    return await this.userService.findById(userId);
  }

  async signUp(signupDto: SignupDto): Promise<User> {
    return this.userService.create(signupDto);
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const userResult = await this.userService.signIn(loginDto);

    if (!userResult) {
      throw new UnauthorizedException('Invalid Credentials!');
    }

    const payload = { userResult };
    const accessToken = await this.jwtService.sign(payload);

    const signInResponse: LoginResponseDto = { ...userResult, accessToken };

    return signInResponse;
  }
}
