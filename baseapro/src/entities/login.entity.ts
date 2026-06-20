import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users') // Cible bien la table 'users' de votre base de données
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

  // 🚀 LES COLONNES INDISPENSABLES INTÉGRÉES DANS LA TABLE USERS
  @Column({ nullable: true })
  resetPasswordToken?: string;

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpires?: Date;
}