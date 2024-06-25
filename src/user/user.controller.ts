import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Patch,
  UseGuards,
  Delete,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignupDto } from './dto/signupDto.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard';
import { UpdateUserDto } from './dto/updateUserDto.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: SignupDto) {
    return this.userService.create(createUserDto);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':type/:id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
