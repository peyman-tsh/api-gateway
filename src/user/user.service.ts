import { HttpException, Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { CreateUserDto } from "./dto/create-user.dto";
import { IUserRes } from "src/interfaces/IUser";
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy
  ) {}
async createUser(createUserDto:CreateUserDto):Promise<IUserRes>{
    const userRes:IUserRes=await firstValueFrom(
        this.userClient.send({cmd:'createUser'},createUserDto)
    );
  if(userRes.status==200){
    return userRes;
  }
   throw new HttpException(userRes.err.error.message,
    userRes.err.error.status
   )
}

async getUser(id:string):Promise<IUserRes>{
    const result:IUserRes=await firstValueFrom(
        this.userClient.send({ cmd: 'getUser' }, { id })
      );
      if(result.status==200){
       return result;
      }
      throw new HttpException(result.err.error.message,result.err.error.status);
}

} 