import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupDto } from './dto/signupDto.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/loginDto.dto';
import { LoginResponseDto } from './dto/loginResponse.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findById(id: string): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async create(signupDto: SignupDto): Promise<User> {
    const { email, password, name } = signupDto;
    const user = new User();

    user.salt = await bcrypt.genSalt();
    user.password_hashed = await this.hashPassword(password, user.salt);
    user.email = email;
    user.name = name;
    user.createdAt = new Date();

    try {
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async signIn(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (user && user.validatePassword(password)) {
      const userResponse = new LoginResponseDto();

      userResponse.username = user.name;
      userResponse.email = user.email;
      return userResponse;
    } else {
      return null;
    }
  }
}
