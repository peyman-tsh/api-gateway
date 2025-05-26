export interface IUserRes{
 status:number,
 message:IUser,
 err:IUserError
}

interface IUser{
    _id:string,
    email:string,
    password:string,
    fullName:string,
    sqlId:number,
    role:string,
    createdAt:Date,
    updatedAt:Date
}

interface IUserError{
    error:{
        status:number,
        message:string
    }
}
