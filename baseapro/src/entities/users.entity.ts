import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users') // Nom de la table dans PostgreSQL
export class Users {
  @PrimaryGeneratedColumn() // ID auto-incrémenté
  users_id!: number;

  @Column()
  nom!: string;

  @Column()
  prenom!: string;

  @Column({ default: 'USER' }) // Rôle par défaut (notez le singulier 'USER')
  role!: string;

  @Column({ unique: true }) // Email unique pour éviter les doublons
  email!: string;

  @Column()
  password!: string;
}