 interface IUserAuth{
        id: number,
        email: string,
}

export interface IAuthRes{
    status:number,
        message:{
            accessToken: string,
            refreshToken: string,
            user:IUserAuth
   }
}


