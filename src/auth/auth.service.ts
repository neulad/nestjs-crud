import { ForbiddenException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private jwtService: JwtService
  ) {}
  async login(email: string, pw: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new ForbiddenException("There's no user with such email!");
    }

    if (!(await bcrypt.compare(pw, user.pw))) {
      throw new ForbiddenException('Provided password is incorrect!');
    }

    const payload = {
      sub: user._id,
      email: user.email,
    };

    return {
      acces_token: this.jwtService.sign(payload),
    };
  }
}
