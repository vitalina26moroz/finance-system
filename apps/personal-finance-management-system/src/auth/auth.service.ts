import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { LoginResponseDto } from '../user/dto/loginResponse.dto';
import { UserType } from '../types/userType';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);
    console.log(user);
    const ps = await bcrypt.hash(password, user.salt);
    console.log(ps);
    const passwordIsMatch = ps === user.password;

    if (user && passwordIsMatch) {
      return user;
    }

    throw new UnauthorizedException('User or password are incorrect!');
  }

  async login(user: UserType): Promise<LoginResponseDto> {
    console.log('hereeeee');
    const { id, email } = user;
    return {
      id,
      email,
      token: await this.jwtService.signAsync({
        id: user.id,
        email: user.email,
      }),
    };
  }
}
