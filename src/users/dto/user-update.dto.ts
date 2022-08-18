import { Type } from 'class-transformer';
import {
  IsAlpha,
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class Name {
  @IsOptional()
  @IsString()
  @IsAlpha()
  @Length(1, 100)
  firstName: string;

  @IsOptional()
  @IsString()
  @IsAlpha()
  @Length(1, 100)
  lastName: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  pw: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Name)
  name: Name;
}
