import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class PushSubscription { 
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text', { unique: true }) // 'unique' est important pour ne pas dupliquer
  endpoint!: string;

  @Column('jsonb') // 'jsonb' est préférable à 'simple-json' pour PostgreSQL
  keys!: { auth: string; p256dh: string };

  @Column({ nullable: true })
  userId!: number;
}