import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Transform } from 'class-transformer';
import { Name } from '../dto/user-create.dto';

@Schema({ timestamps: true })
export class User {
  @Transform(({ obj }) => obj._id.toString())
  _id: string;
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, minLength: 8 })
  @Exclude()
  pw: string;

  @Prop(
    raw({
      firstName: {
        type: String,
        minLength: 1,
        maxLength: 100,
      },
      lastName: {
        type: String,
        minLength: 1,
        maxLength: 100,
      },
    })
  )
  name: Name;

  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  __v: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
