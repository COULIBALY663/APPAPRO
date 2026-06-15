import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Casier } from '../entities/casier.entity';

@Injectable()
export class CasierService {
  constructor(
    @InjectRepository(Casier)
    private readonly casierRepository: Repository<Casier>,
  ) {}

  // ➕ CREATE : Enregistre un nouveau casier avec les chemins de fichiers
  async createCasier(body: any, files: any): Promise<Casier> {
    const donnees = {
      ...body,
      extrait: files?.extrait?.[0]?.path || null,
      recto_piece: files?.recto_piece?.[0]?.path || null,
      verso_piece: files?.verso_piece?.[0]?.path || null,
      acte_individuel: files?.acte_individuel?.[0]?.path || null,
    } as DeepPartial<Casier>;

    const nouveau = this.casierRepository.create(donnees);
    return await this.casierRepository.save(nouveau);
  }

  // 📄 GET ALL : Liste tous les casiers par ordre décroissant
  async getAllCasiers(): Promise<Casier[]> {
    return await this.casierRepository.find({ order: { user_id: 'DESC' } });
  }

  // 🔍 GET BY ID : Recherche un casier spécifique
  async findByCasierId(id: string): Promise<Casier> {
    const casier = await this.casierRepository.findOne({ where: { user_id: id } });
    if (!casier) throw new NotFoundException('Casier introuvable');
    return casier;
  }

  // ✏️ UPDATE : Met à jour les informations et les chemins de fichiers
  async updateCasier(id: string, body: any, files: any): Promise<Casier | null> {
    const casier = await this.findByCasierId(id);
    
    const updateData = {
      ...body,
      extrait: files?.extrait?.[0]?.path || body.extrait || casier.extrait,
      recto_piece: files?.recto_piece?.[0]?.path || body.recto_piece || casier.recto_piece,
      verso_piece: files?.verso_piece?.[0]?.path || body.verso_piece || casier.verso_piece,
      acte_individuel: files?.acte_individuel?.[0]?.path || body.acte_individuel || casier.acte_individuel,
    } as DeepPartial<Casier>;

    await this.casierRepository.update(id, updateData);
    return await this.findByCasierId(id);
  }

  // ❌ DELETE : Supprime un casier par son ID
  async deleteCasier(id: string): Promise<boolean> {
    const result = await this.casierRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}