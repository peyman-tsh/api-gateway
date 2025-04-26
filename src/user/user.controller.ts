import { Controller, Post, Body, Get, Param, Inject, Version } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UseCircuitBreaker } from '../common/decorators/circuit-breaker.decorator';

@ApiTags('users')
@Controller({
  version: '1',
  path: 'users'
})
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy
  ) {}

  @Post()
  @Version('1')
  @UseCircuitBreaker()
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<any> {
    return firstValueFrom(
      this.userClient.send({ cmd: 'create_user' }, createUserDto)
    );
  }

  @Get(':id')
  @Version('1')
  @UseCircuitBreaker()
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getUser(@Param('id') id: string): Promise<any> {
    return firstValueFrom(
      this.userClient.send({ cmd: 'get_user' }, { id })
    );
  }
}