import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id !: number;

  @Column()
  sender!: string; // Numéro du client ou 'SUPPORT'

  @Column()
  receiver!: string;

  @Column('text')
  content!: string;

  @CreateDateColumn()
  createdAt!: Date;
}