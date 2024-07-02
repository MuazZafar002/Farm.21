export interface ILoginProps {
    email : string,
    password: string
}

export interface IRegisterProps {
    email : string,
    password: string
}

export interface IVerifyProps {
    email : string,
    token : string,
    name : string
}

export interface ILoginResponse {
    data : {
        token : string
    }
}

export interface IUser {
    id: string
    email : string,
    name : string,
    desc : string,
    isExpert : boolean,
    profile : string
    createdAt : string,
    coins : number,
    giveTestamonial? : boolean,
    rank : number
}