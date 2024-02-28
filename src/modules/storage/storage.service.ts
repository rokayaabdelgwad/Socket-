import { PrismaService } from '../prisma/prisma.service';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { generateFilename } from '../../utils/imageUpload';
import { MemoryStorageFile } from '@blazity/nest-file-fastify';
import { CustomBadRequestException } from 'src/utils/custom.exceptions';
import { LoggerService } from '../logger/logger.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { Image } from "@prisma/client";
import { Image } from "./image.entity";


@Injectable()
export class storageService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async uploadImage(nationalID_Image:Express.Multer.File): Promise<Image> {
    const image = new Image();
    image.name = nationalID_Image.originalname;
    image.data = nationalID_Image.buffer;

    return await this.imageRepository.save(image);
  }
}
  



