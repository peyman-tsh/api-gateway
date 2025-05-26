import { Body, Controller, Inject, Post, HttpException, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ClientProxy } from '@nestjs/microservices';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { UseCircuitBreaker } from '../common/decorators/circuit-breaker.decorator';
import { AuthService } from './auth.service';
import { RegsiterDto } from './dto/register.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { response, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { IAuthRes } from 'src/interfaces/IAuthRes';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    private readonly authService: AuthService
  ) {}


  @Public()
  @UseGuards(JwtAuthGuard)
  @Post('login')
  @ApiResponse({ status: 200, description: 'login succsesfuly.'})
  @ApiResponse({ status: 401, description: 'login not sucsses.'})
  @ApiResponse({ status: 500, description: 'Service temporarily unavailable. Please try again later.'})
  @ApiBody({
     type: LoginDto,
     description: 'Json structure for user object',
  })
  @UseCircuitBreaker()
  async login(@Body() loginDto: LoginDto,@Res() res:Response) {        
    try {
      const response = await this.authService.login(loginDto);
      res.status(response.status).json(response.message)
    } catch (error) {
      console.log(error);
      
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Public()
  @UseGuards(JwtAuthGuard)
  @Post('/register')
  @ApiResponse({ status: 200, description: 'register succsesfuly.'})
  @ApiResponse({ status: 400, description: 'bad request.'})
  @ApiResponse({ status: 500, description: 'Service temporarily unavailable. Please try again later.'})
  @ApiBody({
     type: LoginDto,
     description: 'Json structure for user object',
  })
  @UseCircuitBreaker()
  async register(@Body() registerDto:RegsiterDto,@Res() res:Response){
   try{
     const register =await this.authService.register(registerDto);
     res.status(register.status).json(register.message)
   }catch(error){
    throw new HttpException(error.message, error.status || 500);
   }
  }

}