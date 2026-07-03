import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class PushSubscription { // <--- AJOUTEZ 'export' ICI
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  endpoint!: string;

  @Column('simple-json')
  keys!: { auth: string; p256dh: string };

  @Column({ nullable: true })
  userId!: number;
}