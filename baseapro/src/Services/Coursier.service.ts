import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coursier } from '../entities/coursier.entity';
import { Paiement } from '../entities/paiement.entity';

@Injectable()
export class CoursierService {
  constructor(
    @InjectRepository(Coursier) 
    private readonly coursierRepository: Repository<Coursier>,
    
    @InjectRepository(Paiement) 
    private readonly paiementRepository: Repository<Paiement>,
  ) {}

  // Copiez cette signature exacte (notez le paramètre 'files')
async createWithPaymentCheck(
  data: any, 
  paiementId: number, 
  files: any // <--- C'est ici que l'erreur se situait
): Promise<Coursier> {
    
  const paiement = await this.paiementRepository.findOne({ 
      where: { id: paiementId },
      relations: ['coursier'] 
  });
  
  if (!paiement) throw new NotFoundException("Paiement introuvable.");
  if (paiement.statut !== 'paid' && paiement.statut !== 'success') {
    throw new ForbiddenException("Paiement non validé.");
  }
  if (paiement.coursier) {
      throw new ForbiddenException("Ce paiement a déjà été utilisé.");
  }

  // Maintenant 'files' est reconnu ici
  const nouveauCoursier = this.coursierRepository.create({
    IP: data.IP,
    FILIERE: data.FILIERE,
    nom: data.nom,
    date_nais: data.date_nais,
    Lieu_nais: data.Lieu_nais,
    telephone: data.telephone,
    recto: files?.recto_piece ? files.recto_piece[0].buffer.toString('base64') : null,
    verso: files?.verso_piece ? files.verso_piece[0].buffer.toString('base64') : null,
    paiement: paiement 
  });

  return await this.coursierRepository.save(nouveauCoursier);
}
}