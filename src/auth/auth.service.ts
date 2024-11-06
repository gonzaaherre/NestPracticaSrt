import { HttpException, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { hash,compare } from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit{
  constructor(private jwtService: JwtService) {
    super();
  }
  private readonly logger = new Logger('authService');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('db connect');
  }

  async register(registerAuthDto: RegisterAuthDto) {
    const { password,email, ...userData } = registerAuthDto;
    const hashedPassword = await hash(password, 10);

    // Crear usuario con datos compatibles con el tipo de Prisma
    return this.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        email
      },
    });
  }

  async login(loginAuthDto: LoginAuthDto) {
    const email = loginAuthDto.email;
    const user = await this.user.findUnique({
      where: { email,available: true },
    });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    const password = await compare(loginAuthDto.password, user.password);
    if (!password) {
      throw new HttpException(`Password incorrect`,403);
    }
    //firmar token
    const payload = {id:user.id,name:user.nombre};
    const token = this.jwtService.sign(payload);
    const data={
      user:user,
      token,
    }


    return data;
  }

  
}
