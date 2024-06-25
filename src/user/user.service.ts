import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupDto } from './dto/signupDto.dto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { RegisterResponseDto } from './dto/registerResponseDto.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  findById(id: string): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async create(signupDto: SignupDto): Promise<RegisterResponseDto> {
    const { email, password, name } = signupDto;
    const existUser = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
    if (existUser)
      throw new BadRequestException(
        'User with this email already exist! Cannot create User',
      );

    const user = new User();

    user.salt = await bcrypt.genSalt();
    user.password_hashed = await this.hashPassword(password, user.salt);
    user.email = email;
    user.name = name;
    user.createdAt = new Date();

    try {
      const token = this.jwtService.sign({ email: user.email });
      await this.userRepository.save(user);
      return { ...user, token };
    } catch (error) {
      throw error;
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }
}
