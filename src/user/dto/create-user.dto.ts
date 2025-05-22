import { IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'ایمیل کاربر',
    example: 'user@example.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'رمز عبور کاربر',
    example: 'password123',
    minLength: 6
  })
  @IsString()
  @MinLength(6)
  password: string;

  
  @ApiProperty({
    description: 'نام و نام خانوادگی کاربر',
    example: 'علی تقی تاش',
    minLength: 6
  })
  @IsString()
  fullName: string;
} 