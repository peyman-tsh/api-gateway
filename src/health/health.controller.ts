import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, MicroserviceHealthIndicator } from '@nestjs/terminus';
import { Transport } from '@nestjs/microservices';
import { Public } from '../auth/decorators/public.decorator';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private microservice: MicroserviceHealthIndicator,
  ) {}

  @Public()
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.microservice.pingCheck('auth-service', {
        transport: Transport.TCP,
        options: { host: process.env.AUTH_SERVICE_HOST, port: process.env.AUTH_SERVICE_PORT },
      }),
      () => this.microservice.pingCheck('user-service', {
        transport: Transport.TCP,
        options: { host: process.env.USER_SERVICE_HOST, port: process.env.USER_SERVICE_PORT },
      }),
    ]);
  }
} 