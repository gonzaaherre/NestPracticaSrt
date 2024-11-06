import { HttpException, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';

@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit{
  private readonly logger = new Logger('userService');
  async onModuleInit() {
    await this.$connect();
    this.logger.log('db connect');
  }
  async create(createUserDto: CreateUserDto) {
    try {
      return await this.user.create({ data: createUserDto });
    } catch (error) {
      this.logger.error('Error al crear usuario ', error);
      throw new HttpException('creacion fallida', 500);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const {page,limit} = paginationDto;
    const totalPages = await this.user.count({where:{available: true}});//total de paginas
    const lastPages = Math.ceil(totalPages/limit);

    return{
      data: await this.user.findMany({
        skip: (page-1)*limit,//para ver la pagina actual
        take: limit,//cuantos quiere ver por pagina
        where:{available:true}
      }),
      meta:{
        totalUsers: totalPages,
        pageActual: page,
        lastPage: lastPages
      }
    }
  }

  async findOne(id: number) {
    const user = await this.user.findUnique({
       where: { id,available: true }
       });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    this.logger.log(`actualizando usuario: ${id}`);
    const{... data}= updateUserDto;//... data tiene todos los campos menos id
    await this.findOne(id);
    return this.user.update({
      where:{id},
      data: data
    });
  }

  async remove(id: number) {
    this.logger.log(`eliminando usuario id ${id}`);
    const user = this.user.update({
      where: { id },
      data: { available:false }
    });
    return user;
  }
}
