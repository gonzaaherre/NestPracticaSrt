import { Type } from "class-transformer";
import { IsEmail, IsNumber, IsPositive, IsString, Max, MaxLength, Min, MinLength } from "class-validator";
export class CreateUserDto {
    @IsString()
    public nombre: string;

    @IsString()
    apellido: string;

    @IsNumber()
    @IsPositive()
    edad: number;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    password: string;

}
 