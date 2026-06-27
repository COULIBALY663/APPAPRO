import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Certificat } from '../entities/certificat.entity';
import { Paiement } from '../entities/paiement.entity';

@Injectable()
export class CertificatService {
  constructor(
    @InjectRepository(Certificat)
    private readonly certificatRepository: Repository<Certificat>,
    @InjectRepository(Paiement)
    private readonly paiementRepository: Repository<Paiement>,
  ) {}

  async createCertificat(body: any, files: any): Promise<Certificat> {
    const donnees: DeepPartial<Certificat> = {
      ...body,
      extrait: files?.extrait?.[0]?.path || null,
      parent_recto: files?.parent_recto?.[0]?.path || null,
      parent_verso: files?.parent_verso?.[0]?.path || null,
      recto_piece: files?.recto_piece?.[0]?.path || null,
      verso_piece: files?.verso_piece?.[0]?.path || null,
      acte_individuel: files?.acte_individuel?.[0]?.path || null,
      situationmatrimoniale: body.situationmatrimoniale ,
      nomconjoint: body.nomconjoint || null,
    };

    const nouveau = this.certificatRepository.create(donnees);
    return await this.certificatRepository.save(nouveau);
  }

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
}