import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('casier') // Nom de la table dans la base de données
export class Casier {
    @PrimaryColumn() // On utilise PrimaryColumn si user_id est fourni par ailleurs
    user_id!: string;

    @Column()
    nom!: string;

    @Column()
    prenom!: string;

    @Column()
    telephone!: number;

    @Column()
    extrait!: string;

    @Column()
    parent_recto!: string;

    @Column()
    parent_verso!: string;

    @Column()
    recto_piece!: string;

    @Column()
    verso_piece!: string;

    @Column()
    acte_individuel!: string;
}