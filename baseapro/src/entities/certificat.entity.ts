import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Paiement } from './paiement.entity';

@Entity('certificat')
export class Certificat {
    @PrimaryGeneratedColumn() // Nombre (auto-incrément)
    id!: number;

    @Column()
    nom!: string;

    @Column()
    prenom!: string;

   @Column({ type: 'varchar', length: 20, nullable: true })
   telephone!: string;

    @Column()
    statut?: string; // Ajouté car utilisé dans votre logique de service

    @Column({ nullable: true })
    extrait?: string;

    @Column({ nullable: true })
    parent_recto?: string;

    @Column({ nullable: true })
    parent_verso?: string;

    @Column({ nullable: true })
    recto_piece?: string;

    @Column({ nullable: true })
    verso_piece?: string;

    @Column({ nullable: true })
    acte_individuel?: string;

    @Column({ nullable: true })
    nomconjoint?: string;

    @Column({ default: 'Célibataire' })
    situationmatrimoniale!: string; // Doit être en minuscule comme dans votre Service

    @OneToOne(() => Paiement, { nullable: true })
    @JoinColumn({ name: 'paiement_id' })
    paiement?: Paiement; // Ajouté pour faire le lien relationnel
}