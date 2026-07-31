import { Commentaire } from "../entities/commentaire.entity";

export const COMMENTAIRE_REPOSITORY = "COMMENTAIRE_REPOSITORY";

export interface ICommentaireRepository {
  create(data: Partial<Commentaire>): Promise<Commentaire>;
  findAll(): Promise<Commentaire[]>;
  delete(id: number): Promise<void>;
  repondre(id: number, reponse: string): Promise<Commentaire>;
}