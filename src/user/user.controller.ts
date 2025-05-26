import { Controller, Post, Body, Get, Param, Inject, Version, Res } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UseCircuitBreaker } from '../common/decorators/circuit-breaker.decorator';;
import { UserService } from './user.service';
import { IUserRes } from 'src/interfaces/IUser';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService:UserService
  ) {}

  @Post('adduser')
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @UseCircuitBreaker()
  async createUser(@Body() createUserDto: CreateUserDto):Promise<IUserRes> {
   const result =await this.userService.createUser(createUserDto);
    return result;
  }

  @Get(':id')
  @Version('1')
  @UseCircuitBreaker()
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getUser(@Param('id') id: string):Promise<IUserRes> {
   const result=await this.userService.getUser(id);
   return result;
  }
}