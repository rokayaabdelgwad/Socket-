import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './image.entity'; // You should have an entity class for Image

@Injectable()
export class ImageRepository {
    constructor(
        @InjectRepository(Image)
        private readonly imageRepository: Repository<Image>,
    ) {}

    async findById(id: number): Promise<Image> {
        return await this.imageRepository.findOne({ where: { id } });
    }

    async findAll(): Promise<Image[]> {
        return await this.imageRepository.find();
    }

    async create(imageData: Partial<Image>): Promise<Image> {
        return await this.imageRepository.create(imageData);
    }

    async update(id: number, updatedData: Partial<Image>): Promise<Image> {
        const imageToUpdate = await this.imageRepository.findOne({ where: { id } });
        if (!imageToUpdate) {
            throw new Error(`Image with id ${id} not found.`);
        }
        const updatedImage = await this.imageRepository.save({
            ...imageToUpdate,
            ...updatedData,
        });
        return updatedImage;
    }

    async delete(id: number): Promise<void> {
        const imageToDelete = await this.imageRepository.findOne({ where: { id } });
        if (!imageToDelete) {
            throw new Error(`Image with id ${id} not found.`);
        }
        await this.imageRepository.remove(imageToDelete);
    }
}
