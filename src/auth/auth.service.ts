import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserType } from 'src/types/userType';
import * as bcrypt from 'bcrypt';
import { LoginResponseDto } from 'src/user/dto/loginResponse.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);
    const passwordIsMatch = bcrypt.hash(password, user.salt) === user.password;

    if (user && passwordIsMatch) {
      return user;
    }

    throw new UnauthorizedException('User or password are incorrect!');
  }

  async login(user: UserType): Promise<LoginResponseDto> {
    const { id, email } = user;
    return {
      id,
      email,
      token: this.jwtService.sign({ id: user.id, email: user.email }),
    };
  }
}
