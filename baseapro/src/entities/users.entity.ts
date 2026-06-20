import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn()
  users_id!: number;

  @Column()
  nom!: string;

  @Column()
  prenom!: string;

  @Column({ default: 'USER' })
  role!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  // 🚀 CES LIGNES CORRIGENT LES ERREURS TS2339
  @Column({ nullable: true })
  resetPasswordToken?: string;

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpires?: Date;
}