import { Controller, Post, Body, Get, Param, Inject, Version, Res } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UseCircuitBreaker } from '../common/decorators/circuit-breaker.decorator';
import { Response } from 'express';
import { UserService } from './user.service';

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
  async createUser(@Body() createUserDto: CreateUserDto,@Res() response:Response) {
   const result =await this.userService.createUser(createUserDto);
   response.status(result.status).json(result.message);
  }

  @Get(':id')
  @Version('1')
  @UseCircuitBreaker()
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getUser(@Param('id') id: string,@Res() response:Response) {
   const result=await this.userService.getUser(id);
   response.status(result.status).json(result.message);
  }
}