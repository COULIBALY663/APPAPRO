import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import type { ICasierRepository } from '../repository/casier.repository';

@Injectable()
export class CasierService implements ICasierRepository {

    constructor(
        @Inject('PG_POOL')
        private readonly db: Pool,
    ) { }

    // ➕ CREATE
    async createCasier(body: any, files: any) {

        const result = await this.db.query(
            `INSERT INTO casier (
        nom,
        prenom,
        telephone,
        extrait,
        recto_piece,
        verso_piece,
        acte_individuel
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
            [
                body.nom,
                body.prenom,
                body.telephone,

                files?.extrait?.[0]?.path || null,
                files?.recto_piece?.[0]?.path || null,
                files?.verso_piece?.[0]?.path || null,
                files?.acte_individuel?.[0]?.path || null,
            ],
        );

        return result.rows[0];
    }

    // 📄 GET ALL
    async getAllCasiers() {
        const result = await this.db.query(
            'SELECT * FROM casier ORDER BY id DESC'
        );
        return result.rows;
    }

    // 📄 GET BY ID
    async findByCasierId(casier_id: number) {

        const result = await this.db.query(
            'SELECT * FROM certificat WHERE id = $1',
            [casier_id],
        );

        return result.rows[0] || null;
    }

    // ✏️ UPDATE
    async updateCasier(
        certificat_id: number,
        body: any,
        files: any,
    ) {

        const result = await this.db.query(
            `UPDATE casier SET
        nom = $1,
        prenom = $2,
        telephone = $3,
        extrait = $4,
        recto_piece = $5,
        verso_piece = $6,
        acte_individuel = $7,
      WHERE id = $8,
      RETURNING *`,
            [
                body.nom,
                body.prenom,
                body.telephone,

                files?.extrait?.[0]?.path || body.extrait || null,
                files?.recto_piece?.[0]?.path || body.recto_piece || null,
                files?.verso_piece?.[0]?.path || body.verso_piece || null,
                files?.acte_individuel?.[0]?.path || body.acte_individuel || null,

                'casier_id',
            ],
        );

        return result.rows[0] || null;
    }

    // ❌ DELETE
    async deleteCasier(casier_id: number) {

        const result = await this.db.query(
            'DELETE FROM casier WHERE id = $1',
            [casier_id],
        );

        return (result.rowCount ?? 0) > 0;
    }
}