import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('login') // Définit le nom de la table dans PostgreSQL
export class Login {
  @PrimaryGeneratedColumn()
  id_login!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  // 🚀 CES COLONNES SONT INDISPENSABLES POUR LE RESET MOT DE PASSE
  @Column({ nullable: true })
  resetPasswordToken?: string;

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpires?: Date;
}