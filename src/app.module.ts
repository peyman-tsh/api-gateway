import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { RedisThrottlerGuard } from './common/guards/redis-throttler.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: 100,
    }]),
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        useFactory: () => ({
          transport: Transport.TCP,
          options: {
            host: process.env.AUTH_SERVICE_HOST ?? 'localhost',
            port: parseInt(process.env.AUTH_SERVICE_PORT ?? '3001'),
          },
        }),
      },
      {
        name: 'USER_SERVICE',
        useFactory: () => ({
          transport: Transport.TCP,
          options: {
            host: process.env.USER_SERVICE_HOST ?? 'localhost',
            port: parseInt(process.env.USER_SERVICE_PORT ?? '3002'),
          },
        }),
      },
    ]),
    AuthModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: RedisThrottlerGuard,
    },
  ],
})
export class AppModule {} 