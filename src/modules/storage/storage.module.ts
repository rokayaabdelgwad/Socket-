import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from './storage.service';
import { LoggerModule } from '../logger/logger.module';
@Module({
    imports:[LoggerModule],
    providers: [StorageService, PrismaService],
})
export class StorageModule {}
