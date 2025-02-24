import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { PASSWORD_PATTERN } from '../auth.constants';

// public registration
export class RegisterUserDto {
  @ApiProperty({ default: 'example@domain.com' })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ default: 'Abcd1234*' })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(PASSWORD_PATTERN, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  fullName: string;
}
