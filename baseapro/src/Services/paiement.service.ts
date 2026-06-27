import { Injectable } from "@nestjs/common";
import axios from "axios";
import { PaiementRepository } from "../repository/paiement.repository";

@Injectable()
export class PaiementService {
  constructor(private readonly paiementRepo: PaiementRepository) {}

  // =========================================================================
  // 1. INIT PAIEMENT
  // =========================================================================
  async initPaiement(data: any) {
    const certificat_id = data?.certificat_id || data?.body?.certificat_id || data?.certificatId || data?.body?.certificatId;
    const telephone = data?.telephone || data?.body?.telephone;
    const montant = data?.montant || data?.body?.montant;
    const type_service = data?.type_service || data?.body?.type_service;

    if (!certificat_id) throw new Error("Certificat requis");
    if (!telephone) throw new Error("Téléphone requis");
    if (!montant) throw new Error("Montant requis");
    if (!type_service) throw new Error("Type service requis");

    const baseUrl = process.env.PAYDUNYA_BASE_URL;
    if (!baseUrl) throw new Error("PAYDUNYA_BASE_URL manquant dans le fichier .env");

    const transaction_id = "TXN-" + Date.now();

    await this.paiementRepo.createPaiement({
      transaction_id,
      telephone,
      montant,
      type_service,
      certificat_id: Number(certificat_id), 
      metadata: "{}", 
      statut: "pending",
    });

    const payload = {
      invoice: { 
        total_amount: montant, 
        description: `Paiement Service - ${type_service.toUpperCase()}` 
      },
      store: { name: "Academy Pro" },
      customer: {
        phone_number: telephone,
        email: `${telephone}@academypro.ci`, 
        first_name: "Client",
        last_name: "Academy",
      },
      actions: {
        cancel_url: process.env.PAYDUNYA_CANCEL_URL,
        return_url: process.env.PAYDUNYA_RETURN_URL,
      },
      invoice_config: {
        hide_components: ["customer_email", "customer_firstname", "customer_lastname"]
      },
      setup: {
        hide_components: ["customer_email", "customer_firstname", "customer_lastname"]
      },
      notify_url: process.env.PAYDUNYA_NOTIFY_URL,
      metadata: { transaction_id }, 
    };

    try {
      const response = await axios.post(`${baseUrl}/checkout-invoice/create`, payload, {
        headers: {
          "Content-Type": "application/json",
          "PAYDUNYA-MASTER-KEY": process.env.PAYDUNYA_MASTER_KEY,
          "PAYDUNYA-PRIVATE-KEY": process.env.PAYDUNYA_PRIVATE_KEY,
          "PAYDUNYA-TOKEN": process.env.PAYDUNYA_TOKEN,
        },
      });

      const dataResponse = response.data;
      const paymentUrl = dataResponse.response_text; 
      const token = dataResponse.token;

      if (!paymentUrl) {
        throw new Error("URL paiement introuvable dans la réponse PayDunya");
      }

      await this.paiementRepo.updateStatut(
        transaction_id,
        "processing",
        token,
        paymentUrl,
        JSON.stringify(dataResponse)
      );

      return { success: true, payment_url: paymentUrl, transaction_id };

    } catch (error: any) {
      throw new Error(error.response?.data?.response_text || error.message || "Erreur PayDunya");
    }
  }

  async notify(data: any) {
    console.log("📥 [WEBHOOK] Données brutes reçues :", JSON.stringify(data));

    // Extraction de la structure PayDunya
    const root = data.data ? data.data : data;
    const token = root.invoice?.token;
    const rawStatus = root.status;

    console.log(`🔍 Extraction - Token: ${token}, Statut: ${rawStatus}`);

    if (!token) {
      console.error("❌ Notification ignorée : Aucun token trouvé.");
      return;
    }

    const paiement = await this.paiementRepo.findByPaydunyaToken(token);
    if (!paiement) {
      console.error(`❌ Paiement introuvable pour le token : ${token}`);
      return;
    }

    // Normalisation du statut
    let statut = "processing";
    if (rawStatus === "completed") {
      statut = "paid";
    } else if (["failed", "cancelled"].includes(rawStatus)) {
      statut = rawStatus;
    }

    // Mise à jour unique
    await this.paiementRepo.updateStatut(
      paiement.transaction_id,
      statut,
      token,
      paiement.payment_url,
      JSON.stringify(data)
    );
    
    console.log(`✅ Base de données mise à jour : ${paiement.transaction_id} -> ${statut}`);
  }

  async findAll() {
    return this.paiementRepo.findAll();
  }

  async check(transaction_id: string) {
    return this.paiementRepo.findByTransactionId(transaction_id);
  }
}