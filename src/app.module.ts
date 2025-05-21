import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RedisThrottlerStorage } from './common/guards/redis-throttler.guard';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseTransformer } from './common/transformers/response.transformer';

@Module({
  imports: [

    JwtModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.get('THROTTLE_TTL') || 60,
            limit: config.get('THROTTLE_LIMIT') || 10,
          },
        ],
        storage: new ThrottlerStorageRedisService(),
      }),
    }),
    AuthModule,
    UserModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // استفاده از JwtAuthGuard به عنوان APP_GUARD
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor, // استفاده از LoggingInterceptor به عنوان APP_INTERCEPTOR
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // فعال‌سازی محدودیت سرعت
    },
    {
      provide:APP_FILTER,
      useClass:GlobalExceptionFilter
    },
    RedisThrottlerStorage,
    ResponseTransformer
  ],
})
export class AppModule {}