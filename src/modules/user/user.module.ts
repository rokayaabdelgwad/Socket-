import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { LoggerModule } from '../logger/logger.module';

@Module({
  // imports:[TypeOrmModule.forFeature([UserDto]),forwardRef(() => PrismaService)],
  imports:[LoggerModule ,],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
