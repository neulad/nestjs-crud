import { Type } from 'class-transformer';
import {
  IsAlpha,
  IsDefined,
  IsEmail,
  IsString,
  Length,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class Name {
  @IsDefined()
  @IsString()
  @IsAlpha()
  @Length(1, 100)
  firstName: string;

  @IsDefined()
  @IsString()
  @IsAlpha()
  @Length(1, 100)
  lastName: string;
}

export class CreateUserDto {
  @IsDefined()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsString()
  @MinLength(8)
  pw: string;

  @IsDefined()
  @ValidateNested()
  @Type(() => Name)
  name: Name;
}
