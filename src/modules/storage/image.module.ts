import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './image.entity';
import { ImageRepository } from './image.repository'; // Import the ImageRepository class

@Module({
  imports: [TypeOrmModule.forFeature([Image])],
  providers: [ImageRepository], // Register the ImageRepository as a provider
  exports: [ImageRepository], // Export the ImageRepository to be used in other modules
})
export class ImageModule {}