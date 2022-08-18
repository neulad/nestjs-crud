import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/user-create.dto';
import { UpdateUserDto } from './dto/user-update.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const userExists = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (userExists) {
      throw new ConflictException('User with this email already exists!');
    }

    return this.userModel.create(createUserDto);
  }

  findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  findOne(user: User, userId: string): Promise<User> {
    if (user._id.toString() !== userId) {
      throw new ForbiddenException('You are trying to acces a different user!');
    }

    return this.userModel.findOne({ _id: userId }).exec();
  }

  async update(user: User, updateUserDto: UpdateUserDto, userId: string) {
    if (user._id.toString() !== userId) {
      throw new ForbiddenException(
        'You are trying to update a different user!'
      );
    }

    const userExists = await this.userModel.findOne({
      email: updateUserDto.email,
    });

    /**
     * Check that user is not trying to update email
     * to existing one (not their)
     */
    if (userExists && userExists._id.toString() !== userId) {
      throw new ConflictException('User with this email already exists!');
    }

    await this.userModel.updateOne({ _id: userId }, updateUserDto).exec();

    const newUser = await this.userModel.findOne({ _id: userId });

    return newUser;
  }

  remove(user: User, userId: string) {
    if (user._id.toString() !== userId) {
      throw new ForbiddenException(
        'You are trying to delete a different user!'
      );
    }

    return this.userModel.deleteOne({ _id: userId });
  }
}
