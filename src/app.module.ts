import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserController } from './modules/user/user.controller';
import { UserService } from './modules/user/user.service';
import { PrismaService } from './modules/prisma/prisma.service';
import { LoggerModule } from './modules/logger/logger.module';

import { SocketGateway } from './modules/socket/socket.gateway';
import { SocketService } from './modules/socket/socket.service';
import { SocketTokenService } from './modules/socket/auth';

import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from 'process';
@Module({
  imports: [EventEmitterModule.forRoot(),ConfigModule.forRoot({ isGlobal: true }),AuthModule,LoggerModule],
  controllers: [UserController],
  providers: [UserService, PrismaService ,SocketGateway,SocketService,SocketTokenService],
})
export class AppModule {}
