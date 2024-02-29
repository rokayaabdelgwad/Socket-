import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AuthDto{
    constructor( email:string, password:string){
        this.email = email;
        this.password = password;
    }

    @IsEmail()
     @IsOptional()
    email:String ;

    @IsOptional()
    @IsString()
    password:String
}