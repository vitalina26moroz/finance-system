import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupDto } from './dto/signupDto.dto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { RegisterResponseDto } from './dto/registerResponseDto.dto';
import { UpdateUserDto } from './dto/updateUserDto.dto';
import { User } from '@app/db/entities/user.entity';

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
    user.password = await bcrypt.hash(password, user.salt);
    user.email = email;
    user.name = name;
    user.createdAt = new Date();

    try {
      const token = this.jwtService.sign({ email: user.email });
      await this.userRepository.save(user);
      return { ...user, token };
    } catch (error) {
      throw new Error('Failed to create user in database');
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) throw new NotFoundException('User not found!');

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        user.salt,
      );
    }

    return await this.userRepository.update(id, updateUserDto);
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) throw new NotFoundException('User not found!');

    return await this.userRepository.delete(id);
  }
}
