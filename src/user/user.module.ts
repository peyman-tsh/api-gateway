import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserService } from './user.service';

@Module({
  imports: [   
    ClientsModule.register([
    {
      name: 'USER_SERVICE',
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'user_queue',
        queueOptions: {
          durable: false
        },
      },
    },
  ]),],
  providers:[UserService],
  controllers: [UserController],
})
export class UserModule {} 