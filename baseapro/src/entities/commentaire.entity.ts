import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("commentaires")
export class Commentaire {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  nom!: string;

  @Column({ type: "text" })
  commentaire!: string;

  @Column({ default: 5 })
  note!: number;

  @Column({ default: true })
  actif!: boolean;

  @Column({ nullable: true, type: "text" })
  reponseAdmin!: string;

  @CreateDateColumn()
  createdAt!: Date;
}