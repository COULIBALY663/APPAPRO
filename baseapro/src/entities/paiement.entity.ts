import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from "typeorm";
import { Coursier } from "./coursier.entity";

@Entity()
export class Paiement {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    unique: true,
  })
  transaction_id!: string;

  @Column({
    nullable: true,
  })
  certificat_id!: number;

  // 🎯 CORRIGÉ : On utilise 'token' pour correspondre au Repository, 
  // mais on garde le nom physique 'paydunya_token' en base de données pour ne pas casser tes tables.
  @Column({
    name: "paydunya_token",
    nullable: true,
  })
  token!: string;

  @Column({
    type: "text",
    nullable: true,
  })
  payment_url!: string;

  @Column({
    default: "pending",
  })
  statut!: string;

  @Column({ type: 'varchar', length: 20, nullable: true }) // Ajoutez nullable: true ici
  telephone !: string;

  @Column("decimal", { nullable: true }) 
  montant!: number;

  @Column()
  type_service!: string;

  @Column({
    type: "text",
    nullable: true,
  })
  metadata!: string;

  @Column({
    type: "text",
    nullable: true,
  })
  invoice_data!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
  
  @OneToOne(() => Coursier, (coursier) => coursier.paiement)
  coursier!: Coursier;
}