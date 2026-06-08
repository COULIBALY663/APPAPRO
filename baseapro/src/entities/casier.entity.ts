import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('Casier')
export class Casier {
    @PrimaryColumn()
    user_id!: string; // Supprimez le '!'

    @Column()
    nom!: string;

    @Column()
    prenom!: string;

    @Column()
    telephone!: number;

    // Ajoutez '?' pour les rendre optionnels dans TypeScript
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
}