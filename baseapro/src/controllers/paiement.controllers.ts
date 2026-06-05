import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { PaiementService } from "../Services/paiement.service";
import { CreatePaiementDto } from "../Dtos/paiements.dtos";

@Controller("paiement")
export class PaiementController {
  constructor(private readonly paiementService: PaiementService) {}

  // =========================================================================
  // 1. INIT PAIEMENT (Demande de création de facture vers PayDunya)
  // =========================================================================
  @Post("/init")
  async init(@Body() body: CreatePaiementDto) {
    console.log("🎯 Requête reçue sur /paiement/init :", body);

    return this.paiementService.initPaiement({
      telephone: body.telephone,
      montant: Number(body.montant),
      type_service: body.type_service,
      certificat_id: Number(body.certificat_id),
    });
  }

  // =========================================================================
  // 2. NOTIFY (Webhook de PayDunya qui fait passer le statut à 'paid')
  // =========================================================================
  @Post("/notify")
  @HttpCode(HttpStatus.OK)
  async notify(@Body() body: any) {
    console.log("📥 Signal Webhook reçu dans le contrôleur !");
    await this.paiementService.notify(body);
    return { status: "success", message: "Notification traitée" };
  }

  // =========================================================================
  // 3. GET ALL PAIEMENTS (🔥 Nouvelle route indispensable pour ton React)
  // =========================================================================
  @Get()
  async getAllPaiements() {
    console.log("📊 Demande de la liste des paiements pour le Dashboard");
    return this.paiementService.findAll();
  }

  // =========================================================================
  // 4. CHECK (Pour rafraîchir une seule transaction si besoin)
  // =========================================================================
  @Get("/:transaction_id")
  async check(@Param("transaction_id") transaction_id: string) {
    return this.paiementService.check(transaction_id);
  }
}