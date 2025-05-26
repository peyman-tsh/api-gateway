import { Injectable, Inject, HttpException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { LoginDto } from './dto/login.dto';
import { RegsiterDto } from './dto/register.dto';
import { IAuthRes } from 'src/interfaces/IAuthRes';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    private readonly jwtService: JwtService
  ) {}

  async login(loginDto: LoginDto):Promise<IAuthRes> {
    const authRes:IAuthRes = await firstValueFrom(
      this.authClient.send({ cmd: 'login' }, loginDto)
    );

    if (authRes) {
      console.log(authRes);
    
     return authRes
    }
    
    throw new UnauthorizedException('نام کاربری یا رمز عبور اشتباه است');
  }

  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      return null;
    }
  }

  async register(registerDto: RegsiterDto):Promise<IAuthRes> {
    try{
    const authRes:IAuthRes = await firstValueFrom(
      this.authClient.send({ cmd: 'register' }, registerDto)
    );
    return authRes;
  }catch(err){
    throw new HttpException(err.message,500)
  }
}
} 