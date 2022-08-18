import { Module } from '@nestjs/common';
import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'User',
        useFactory: () => {
          const schema = UserSchema;
          schema.pre<User>('save', async function () {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(this.pw, salt);
            this.pw = hash;
          });
          return schema;
        },
      },
    ]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [MongooseModule],
})
export class UsersModule {}
