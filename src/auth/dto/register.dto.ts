import { IsString, IsEmail, MinLength , IsNotEmpty , IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegsiterDto {
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
    description: 'رمز عبور کاربر',
    example: 'password123',
    minLength: 6
  })
  @IsString()
  @IsOptional()
  role?:string;

  @ApiProperty({
    description: 'نام کامل کاربر',
  })
  @IsNotEmpty()
  @IsString()
  fullName:string
} 