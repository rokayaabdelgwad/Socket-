
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/user.dto';
import { CustomBadRequestException } from '../../utils/custom.exceptions';
import { LoggerService } from '../../modules/logger/logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.auth.dto';
import passport from 'passport';
import { MemoryStorageFile } from '@blazity/nest-file-fastify';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly loggerService: LoggerService,
   
  ) {}

  async createUser(dto: UserDto, profile_picture: MemoryStorageFile ,nationalID_Image:Express.Multer.File) {
try{
    const email = dto.email.toString();
    const hash = await argon.hash(dto.password.toString());
  
    // Check if a user with the provided email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new NotFoundException(`User with email ${email} already exists`);
    }
  
    const id: string = uuidv4();
    const filename = `profile_picture${id}`;
    const NationalIDImageName = `nationalID_Image${id}`;
    
    const uploadPath = path.join(process.cwd(), 'uploads', 'img', filename);

    // Create directory if it doesn't exist
    if (!fs.existsSync(path.dirname(uploadPath))) {
      fs.mkdirSync(path.dirname(uploadPath), { recursive: true });
    }
 
    const data = {
      ...(dto as any),
      hash: await argon.hash(dto.password.toString()),
      profile_pic: filename,
      nationalIDImage:NationalIDImageName
      
    }
    
    // Create the new user if no user with the provided email exists
    const addedUser = await this.prisma.user.create({
      data
    });

    // Remove 'hash' property from addedUser
    if (addedUser.hasOwnProperty('hash')) {
      delete (addedUser as any).hash;
    }
  
    return addedUser;
  

    } catch (error) {
    if(error instanceof NotFoundException) {
      throw error; // Re-throw the CustomBadRequestException
    } else {
    this.loggerService.logError(error);
    throw new InternalServerErrorException('Error create  user');
  }

    }}
   async findAllUsers() {
    try {
      return this.prisma.user.findMany();
    } catch (error) {
      if(error instanceof NotFoundException) {
        throw error; // Re-throw the CustomBadRequestException
      } else {
      this.loggerService.logError(error);
      throw new InternalServerErrorException('Error finded  users');
    }
  }}

  async findOne(id: number) {
    try {
      const existingUser = await this.prisma.user.findUnique({ where: { id } });
      if (!existingUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return existingUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Re-throw the CustomBadRequestException
      } else {
        this.loggerService.logError(error);
        throw new InternalServerErrorException('Error finded   user');
      }
    }
  }

  async update(id: number, userData: UpdateUserDto) {
    try {
      const existingUser = await this.prisma.user.findUnique({ where: { id } });
      if (!existingUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      const user = await this.prisma.user.update({
        // lastName:userData.lastName?userData.lastName:existingUser.lastName
        where: { id },
        data: {
          email: userData.email ? userData.email : existingUser.email,
          firstName: userData.firstName
            ? userData.firstName
            : existingUser.firstName,
          lastName: userData.lastName
            ? userData.lastName
            : existingUser.lastName,
        },
      });
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Re-throw the NotFoundException
      } else {
        this.loggerService.logError(error);
        console.error('Error updating user:', error);
        throw new InternalServerErrorException('Error updated user');
      }
    }
  }

  async deleteUser(id: number): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });
      if (!user) {
        console.log(`User with ID ${id} not found`);
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      await this.prisma.user.delete({
        where: { id },
      });
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Re-throw the NotFoundException
      } else {
        this.loggerService.logError(error);
        throw new InternalServerErrorException('Error deleted user');
      }
    }
  }
}
