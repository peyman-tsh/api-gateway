import { Body, Controller, Inject, Post, HttpException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { UseCircuitBreaker } from '../common/decorators/circuit-breaker.decorator';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    private readonly authService: AuthService
  ) {}

  @Public()
  @Post('login')
  @UseCircuitBreaker()
  async login(@Body() loginDto: LoginDto) {
    try {
      const response = await this.authService.login(loginDto);
      return response;
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }
}