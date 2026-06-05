import { CreateCertificatDto, UpdateCertificatDto } from "../Dtos/certificat.dto";
import { certificat } from "../models/certificat.models";

export const CERTIFICAT_REPOSITORY = Symbol('CERTIFICAT_REPOSITORY');

export interface ICertificatRepository {

  createCertificat(body: any, files: any[]): Promise<certificat>;

  findByCertificatId(certificat_id: number): Promise<certificat | null>;

  getAllCertificats(): Promise<certificat[]>;

  // 🔥 AJOUTÉ : Pour la mise à jour manuelle du statut par l'agent ("En attente" -> "Traité")
  updateStatutDossier(certificat_id: number, statut: string): Promise<certificat>;

  updateCertificat(
    certificat_id: number,
    body: any,
    files: any[]
  ): Promise<certificat | null>;

  deleteCertificat(certificat_id: number): Promise<boolean>;
}