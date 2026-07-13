import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Paiement } from './paiement.entity';

@Entity('Coursier')
export class Coursier {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  IP!: string;

  @Column()
  FILIERE!: string;

  @Column()
  nom!: string;

  @Column({ type: 'date' })
  date_nais!: Date;

  @Column()
  Lieu_nais!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telephone!: string;

  @Column({ nullable: true })
  recto!: string;

  @Column({ nullable: true })
  verso!: string;

  @OneToOne(() => Paiement, { eager: true })
  @JoinColumn()
  paiement!: Paiement;
}