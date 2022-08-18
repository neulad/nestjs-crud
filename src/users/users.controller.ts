import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import MongooseClassSerializerInterceptor from '../utils/mongooseClassSerializer.interceptor';
import { CreateUserDto } from './dto/user-create.dto';
import { UpdateUserDto } from './dto/user-update.dto';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';

@Controller('users')
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/')
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get('/')
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  async findOne(@Req() req, @Param('id') userId: string) {
    return this.usersService.findOne(req.user, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/:id')
  async update(
    @Req() req,
    @Param('id') userId,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.update(req.user, updateUserDto, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  remove(@Req() req, @Param('id') userId) {
    return this.usersService.remove(req.user, userId);
  }
}
