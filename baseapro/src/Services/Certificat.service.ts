import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Certificat } from '../entities/certificat.entity';
import { Paiement } from '../entities/paiement.entity';
// Importez Cloudinary
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { NotificationGateway } from '../notification.gateway';
import * as webpush from 'web-push';
import { PushSubscription } from '../entities/push-subscription.entity';
import { UploadApiOptions } from "cloudinary";

@Injectable()
export class CertificatService {
  constructor(
    @InjectRepository(Certificat)
    private readonly certificatRepository: Repository<Certificat>,

    @InjectRepository(Paiement)
    private readonly paiementRepository: Repository<Paiement>,

    @InjectRepository(PushSubscription)
    private readonly pushRepository: Repository<PushSubscription>,

    private readonly notificationGateway: NotificationGateway,
  ) {
    // 1. Initialisation VAPID ici (dans le constructeur)
    webpush.setVapidDetails(
      'mailto:ziec2061@gmail.com',
      process.env.VAPID_PUBLIC_KEY, // Correction du nom de variable
      process.env.VAPID_PRIVATE_KEY  // Correction du nom de variable
    );

    // 2. Configuration Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
  // ... reste du service

  // Méthode privée pour uploader vers Cloudinary
private async uploadToCloudinary(
  file: Express.Multer.File
): Promise<string> {

  return new Promise((resolve, reject) => {
let resourceType: UploadApiOptions["resource_type"] = "raw";
    // Si c'est une image
    if (file.mimetype.startsWith("image/")) {
      resourceType = "image";
    }

    const upload = cloudinary.uploader.upload_stream(
      {
        folder: "academy-pro/documents",
        resource_type: resourceType,
      },

      (error, result) => {

        if (error) {
          return reject(error);
        }

        if (result?.secure_url) {
          resolve(result.secure_url);
        } else {
          reject(new Error("URL Cloudinary absente"));
        }

      }
    );

    Readable.from(file.buffer).pipe(upload);

  });
}

  async createCertificat(body: any, files: any): Promise<Certificat> {
  // 1. Upload fichiers
  const fileUrls: any = {};
  for (const key in files) {
    if (files[key] && files[key][0]) {
      fileUrls[key] = await this.uploadToCloudinary(files[key][0]);
    }
  }

  // 2. Création et sauvegarde
 const certificat = await this.certificatRepository.save({
  ...body,
  ...fileUrls,
});
  // 3. Notification WebSocket (Temps réel quand dashboard ouvert)
  this.notificationGateway.envoyerNouvelleDemande(certificat);

  // 4. Notification Push (Quand dashboard fermé)
  const subscriptions = await this.pushRepository.find();
  const payload = JSON.stringify({
    title: "📢 Nouvelle demande",
    body: `Dossier #${certificat.id} reçu.`,
  });

  subscriptions.forEach(sub => {
    webpush.sendNotification({ endpoint: sub.endpoint, keys: sub.keys as any }, payload)
      .catch(err => {
        if (err.statusCode === 410) this.pushRepository.delete(sub.id);
      });
  });

  return certificat;
}

  // ... (gardez vos autres méthodes : getAllCertificats, findByCertificatId, etc.)
  
  async getAllCertificats() {
    const result = await this.certificatRepository.find({
      relations: ['paiement'],
      order: { id: 'DESC' }
    });

    return result.map(certificat => this.appliquerLogiquePaiement(certificat));
  }

  async findByCertificatId(id: number) {
    const certificat = await this.certificatRepository.findOne({ 
      where: { id },
      relations: ['paiement'] 
    });
    
    if (!certificat) throw new NotFoundException('Certificat introuvable');
    return this.appliquerLogiquePaiement(certificat);
  }

  private appliquerLogiquePaiement(certificat: Certificat) {
    const paiement = certificat.paiement;
    if (!paiement) return { ...certificat, statut: certificat.statut || 'En attente', paiement: null };

    const TRENTE_MINUTES = 30 * 60 * 1000;
    let statutFinal = paiement.statut;

    if ((statutFinal === 'processing' || statutFinal === 'pending') && 
        (Date.now() - new Date(paiement.created_at).getTime() > TRENTE_MINUTES)) {
      statutFinal = 'cancelled';
    }

    return { 
      ...certificat, 
      statut: certificat.statut || 'En attente', 
      paiement: { id: paiement.id, statut: statutFinal } 
    };
  }

  async deleteCertificat(id: number) {
    const certificat = await this.findByCertificatId(id);
    if (certificat.paiement?.statut === 'paid' || certificat.paiement?.statut === 'success') {
      throw new BadRequestException('Impossible de supprimer un certificat déjà payé');
    }
    await this.certificatRepository.delete(id);
    return true;
  }
  // Ajoutez cette méthode dans votre classe CertificatService
  async updateStatutDossier(id: number, nouveauStatut: string): Promise<Certificat> {
    // 1. On vérifie d'abord si le certificat existe
    const certificat = await this.certificatRepository.findOne({ where: { id } });
    
    if (!certificat) {
      throw new NotFoundException(`Certificat avec l'ID ${id} introuvable`);
    }

    // 2. On met à jour le statut
    certificat.statut = nouveauStatut;

    // 3. On sauvegarde
    return await this.certificatRepository.save(certificat);
  }
}
