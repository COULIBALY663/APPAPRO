import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('login') // Définit le nom de la table dans PostgreSQL
export class Login {
  @PrimaryGeneratedColumn() // Génère un ID automatiquement
  id_login!: number;

  @Column({ unique: true }) // Recommandé pour un email
  email!: string;

  @Column()
  password!: string;
}