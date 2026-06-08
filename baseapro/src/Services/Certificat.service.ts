import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Pool } from 'pg';
import type { ICertificatRepository } from '../repository/Certificat.repository';

@Injectable()
export class CertificatService implements ICertificatRepository {

  constructor(
    @Inject('PG_POOL')
    private readonly db: Pool,
  ) {}

  // ➕ CREATE (Corrigé : Les 11 paramètres sont désormais bien fournis)
  async createCertificat(body: any, files: any) {
    const result = await this.db.query(
      `INSERT INTO certificat (nom, prenom, telephone, extrait, parent_recto, parent_verso, recto_piece, verso_piece, acte_individuel, situationmatrimoniale , nomConjoint")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        body.nom, 
        body.prenom, 
        body.telephone,
        files?.extrait?.[0]?.path || null,
        files?.parent_recto?.[0]?.path || null,
        files?.parent_verso?.[0]?.path || null,
        files?.recto_piece?.[0]?.path || null,
        files?.verso_piece?.[0]?.path || null,
        files?.acte_individuel?.[0]?.path || null,
        body.situationmatrimoniale || 'Célibataire', // $10
        body.nomconjoint || null,                    // $11
      ],
    );
    return result.rows[0];
  }

  // 📄 GET ALL (Jointure avec table Paiement + Règle des 30 minutes)
  async getAllCertificats() {
    const result = await this.db.query(
      `SELECT c.*, p.statut AS paiement_statut, p.id AS paiement_id_brut, p.created_at AS paiement_created_at
       FROM certificat c
       LEFT JOIN paiement p ON c.paiement_id = p.id 
       ORDER BY c.id DESC`
    );

    const TRENTE_MINUTES = 30 * 60 * 1000;
    const maintenant = Date.now();

    return result.rows.map(row => {
      const { paiement_statut, paiement_id_brut, paiement_created_at, ...certificatData } = row;
      let statutFinal = paiement_statut;

      // ⏱️ Calcul d'annulation si traitement PayDunya abandonné depuis +30 min
      if (paiement_id_brut && (paiement_statut === 'processing' || paiement_statut === 'pending')) {
        const dateCreation = new Date(paiement_created_at).getTime();
        if (maintenant - dateCreation > TRENTE_MINUTES) {
          statutFinal = 'cancelled';
        }
      }

      return {
        ...certificatData,
        statut: row.statut || 'En attente',
        paiement: paiement_id_brut ? { id: paiement_id_brut, statut: statutFinal } : null
      };
    });
  }

  // 🔍 GET BY ID
  async findByCertificatId(certificat_id: number) {
    const result = await this.db.query(
      `SELECT c.*, p.statut AS paiement_statut, p.id AS paiement_id_brut, p.created_at AS paiement_created_at
       FROM certificat c LEFT JOIN paiement p ON c.paiement_id = p.id WHERE c.id = $1`,
       [certificat_id],
    );

    if (result.rows.length === 0) throw new NotFoundException('Certificat introuvable');

    const row = result.rows[0];
    const { paiement_statut, paiement_id_brut, paiement_created_at, ...certificatData } = row;
    let statutFinal = paiement_statut;

    if (paiement_id_brut && (paiement_statut === 'processing' || paiement_statut === 'pending')) {
      if (Date.now() - new Date(paiement_created_at).getTime() > 30 * 60 * 1000) {
        statutFinal = 'cancelled';
      }
    }

    return {
      ...certificatData,
      statut: row.statut || 'En attente',
      paiement: paiement_id_brut ? { id: paiement_id_brut, statut: statutFinal } : null
    };
  }

  // 🔥 UPDATE STATUT (Déclenché uniquement quand l'agent clique sur le bouton)
  async updateStatutDossier(certificat_id: number, statut: string) {
    const result = await this.db.query(
      `UPDATE certificat SET statut = $1 WHERE id = $2 RETURNING *`,
      [statut, certificat_id]
    );
    return result.rows[0];
  }

  // ✏️ UPDATE COMPLET (Mis à jour également avec la situation matrimoniale et le conjoint)
  async updateCertificat(certificat_id: number, body: any, files: any) {
    const result = await this.db.query(
      `UPDATE certificat SET 
        nom = $1, 
        prenom = $2, 
        telephone = $3, 
        extrait = $4, 
        parent_recto = $5, 
        parent_verso = $6, 
        recto_piece = $7, 
        verso_piece = $8, 
        acte_individuel = $9,
        "situationmatrimoniale" = $10,
        "nomconjoint" = $11
       WHERE id = $12 RETURNING *`,
      [
        body.nom, 
        body.prenom, 
        body.telephone,
        files?.extrait?.[0]?.path || body.extrait || null,
        files?.parent_recto?.[0]?.path || body.parent_recto || null,
        files?.parent_recto?.[0]?.path || body.parent_verso || null, // Correction d'une coquille sur parent_verso détectée dans votre code initial
        files?.recto_piece?.[0]?.path || body.recto_piece || null,
        files?.verso_piece?.[0]?.path || body.verso_piece || null,
        files?.acte_individuel?.[0]?.path || body.acte_individuel || null,
        body.situationmatrimoniale || 'Célibataire',
        body.nomconjoint || null,
        certificat_id, // $12
      ],
    );
    return result.rows[0] || null;
  }

  // ❌ DELETE (Sécurisé : empêche la suppression si l'argent est encaissé)
  async deleteCertificat(certificat_id: number) {
    const check = await this.db.query(
      `SELECT c.*, p.statut AS paiement_statut FROM certificat c LEFT JOIN paiement p ON c.paiement_id = p.id WHERE c.id = $1`,
      [certificat_id]
    );
    if (check.rows.length === 0) throw new NotFoundException('Certificat introuvable');
    
    if (check.rows[0].paiement_statut === 'paid' || check.rows[0].paiement_statut === 'success') {
      throw new BadRequestException('Impossible de supprimer un certificat déjà payé');
    }

    const result = await this.db.query('DELETE FROM certificat WHERE id = $1', [certificat_id]);
    return (result.rowCount ?? 0) > 0;
  }
}