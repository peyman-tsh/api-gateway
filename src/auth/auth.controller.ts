import { Body, Controller, Inject, Post, HttpException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { UseCircuitBreaker } from '../common/decorators/circuit-breaker.decorator';
import { AuthService } from './auth.service';
import { RegsiterDto } from './dto/register.dto';

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
      console.log(error);
      
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Public()
  @Post('/register')
  @UseCircuitBreaker()
  async register(@Body() registerDto:RegsiterDto){
   try{
     const register =await this.authService.register(registerDto);
     return register;
   }catch(error){
     throw new HttpException(error.message,error.status||500)
   }
  }
}