import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Paiement } from "../entities/paiement.entity"; // Ajuste le chemin si besoin

@Injectable()
export class PaiementRepository {
  constructor(
    @InjectRepository(Paiement)
    private readonly repository: Repository<Paiement>,
  ) {}

  async createPaiement(data: any) {
    const newPaiement = this.repository.create(data);
    return this.repository.save(newPaiement);
  }

  async findByTransactionId(transaction_id: string) {
    return this.repository.findOne({ where: { transaction_id } });
  }

  // 🎯 ALIGNÉ : Recherche maintenant correctement sur la propriété "token"
  async findByPaydunyaToken(token: string) {
    return this.repository.findOne({ where: { token } });
  }

  // Met à jour le statut, le token, l'URL et sauvegarde la réponse brute dans invoice_data
  async updateStatut(transaction_id: string, statut: string, token: string, payment_url: string, invoice_data: string) {
    return this.repository.update(
      { transaction_id }, 
      { statut, token, payment_url, invoice_data }
    );
  }

  // 📊 Récupère toutes les transactions pour le Dashboard React
  async findAll() {
    return this.repository.find({
      order: { id: "DESC" } // Du plus récent au plus ancien
    });
  }
}