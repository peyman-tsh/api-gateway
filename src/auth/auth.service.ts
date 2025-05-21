import { Injectable, Inject, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { LoginDto } from './dto/login.dto';
import { RegsiterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    private readonly jwtService: JwtService
  ) {}

  async login(loginDto: LoginDto) {
    const user = await firstValueFrom(
      this.authClient.send({ cmd: 'authenticate' }, loginDto)
    );

    if (user) {
      console.log(user);
      
      const payload = { sub: user.id, email: user.email };
      return {
        access_token: this.jwtService.sign(payload),
        user
      };
    }

    return null;
  }

  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      return null;
    }
  }

  async register(registerDto: RegsiterDto) {
    try{
    const registeredUser = await firstValueFrom(
      this.authClient.send({ cmd: 'register' }, registerDto)
    );
    return registeredUser;
  }catch(err){
    throw new HttpException(err.message,500)
  }
}

} 