import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { LoginAuthDto } from './login-auth.dto';

export class RegisterAuthDto extends PartialType(LoginAuthDto) {
    @IsNotEmpty()
    nombre: string;
    @IsNotEmpty()
    apellido: string;
    @IsNumber()
    @IsPositive()
    edad: number;
}
