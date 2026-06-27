import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Certificat } from '../entities/certificat.entity';
import { Paiement } from '../entities/paiement.entity';
// Importez Cloudinary
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CertificatService {
  constructor(
    @InjectRepository(Certificat)
    private readonly certificatRepository: Repository<Certificat>,
    @InjectRepository(Paiement)
    private readonly paiementRepository: Repository<Paiement>,
  ) {
    // Configuration Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  // Méthode privée pour uploader vers Cloudinary
private async uploadToCloudinary(file: Express.Multer.File): Promise<string> {
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      { folder: 'certificats' },
      (error, result) => {
        if (error) return reject(error);
        
        // Utilisation de l'opérateur de chaînage optionnel (?.) 
        // ou vérification explicite pour satisfaire TypeScript
        if (result?.secure_url) {
          resolve(result.secure_url);
        } else {
          reject(new Error('Cloudinary n\'a pas retourné d\'URL'));
        }
      }
    );
    Readable.from(file.buffer).pipe(upload);
  });
}

  async createCertificat(body: any, files: any): Promise<Certificat> {
    const fileUrls: any = {};

    // Uploader chaque fichier trouvé vers Cloudinary
    for (const key in files) {
      if (files[key] && files[key][0]) {
        fileUrls[key] = await this.uploadToCloudinary(files[key][0]);
      }
    }

    // Sauvegarder les URLs au lieu des chemins locaux
    const donnees: DeepPartial<Certificat> = {
      ...body,
      ...fileUrls, 
      situationmatrimoniale: body.situationmatrimoniale,
      nomconjoint: body.nomconjoint || null,
    };

    const nouveau = this.certificatRepository.create(donnees);
    return await this.certificatRepository.save(nouveau);
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
