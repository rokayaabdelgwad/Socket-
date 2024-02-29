// // image.entity.ts

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('longblob')
  data: Buffer;

  @Column()
  url: string;
  
  @Column()
  filename: string;

  @Column()
  mimetype: string;
}
