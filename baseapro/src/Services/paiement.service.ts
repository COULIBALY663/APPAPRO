import { Injectable, Inject } from "@nestjs/common";
import axios from "axios";
import { PaiementRepository } from "../repository/paiement.repository";

@Injectable()
export class PaiementService {
  constructor(
    private readonly paiementRepo: PaiementRepository
  ) {}

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

  // =========================================================================
  // 2. NOTIFY (Webhook de mise à jour automatique du statut)
  // =========================================================================
  async notify(data: any) {
    console.log("==================================================");
    console.log("📥 [WEBHOOK PAYDUNYA] NOTIFICATION REÇUE !");
    console.log("==================================================");

    const token = data?.token || 
                  data?.invoice_token || 
                  data?.invoice?.token || 
                  data?.data?.invoice?.token;

    if (!token) {
      console.error("❌ Échec de la notification : Aucun token trouvé.");
      throw new Error("Token manquant");
    }

    const paiement = await this.paiementRepo.findByPaydunyaToken(token);
    if (!paiement) {
      console.error(`❌ Aucun paiement trouvé pour le token : ${token}`);
      throw new Error("Paiement introuvable en base");
    }

    const rawStatus = data?.data?.status || 
                      data?.status || 
                      data?.invoice?.status || 
                      data?.data?.invoice?.status || 
                      "";
    
    const status = String(rawStatus).toLowerCase().trim();
    let statut: "pending" | "processing" | "paid" | "failed" | "cancelled" = "pending";

    if (["completed", "success", "paid", "reussi"].includes(status)) {
      statut = "paid";
    } else if (["failed", "fail", "echoue"].includes(status)) {
      statut = "failed";
    } else if (["cancelled", "cancel", "annule"].includes(status)) {
      statut = "cancelled";
    } else {
      statut = "processing";
    }

    await this.paiementRepo.updateStatut(
      paiement.transaction_id,
      statut,
      token,
      paiement.payment_url,
      JSON.stringify(data)
    );
    console.log(`✅ Table Paiement mise à jour ! [${paiement.transaction_id}] -> ${statut.toUpperCase()}`);
  }

  // =========================================================================
  // 3. FIND ALL (🔥 Nouvelle méthode appelée par le contrôleur)
  // =========================================================================
  async findAll() {
    return this.paiementRepo.findAll();
  }

  // =========================================================================
  // 4. CHECK
  // =========================================================================
  async check(transaction_id: string) {
    return this.paiementRepo.findByTransactionId(transaction_id);
  }
}