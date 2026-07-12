import {
  Controller,
  Post,
  Body,
  Inject,
  UseInterceptors,
  UploadedFiles,
  Get,
  Param,
  Put,
  Delete,
  BadRequestException,
} from '@nestjs/common';

import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer'; // Importez uniquement memoryStorage

import { CERTIFICAT_REPOSITORY } from '../repository/Certificat.repository';
import type { ICertificatRepository } from '../repository/Certificat.repository';

@ApiTags('Certificat')
@Controller('certificat')
export class CertificatController {

  constructor(
    @Inject(CERTIFICAT_REPOSITORY)
    private readonly certificatRepository: ICertificatRepository,
  ) {}

  // ➕ CREATE AVEC IMAGES (Cloudinary/Supabase prêt)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: "extrait", maxCount: 1 },
        { name: "parent_recto", maxCount: 1 },
        { name: "parent_verso", maxCount: 1 },
        { name: "recto_piece", maxCount: 1 },
        { name: "verso_piece", maxCount: 1 },
        { name: "acte_individuel", maxCount: 1 },
      ],
      { storage: memoryStorage() }, // Plus de diskStorage ici
    ),
  )
  async createCertificat(@Body() body: any, @UploadedFiles() files: any) {
    return this.certificatRepository.createCertificat(body, files);
  }
// 📄 GET ALL
  @Get()
  async getAll() {
    return this.certificatRepository.getAllCertificats();
  }
  // 🔍 GET BY ID
  @Get(':id')
  async findById(@Param('id') id: string) {
    const certificat_id = parseInt(id, 10);
    if (isNaN(certificat_id)) throw new BadRequestException('Invalid certificat_id');
    return this.certificatRepository.findByCertificatId(certificat_id);
  }

  // 🔥 UPDATE STATUT (Appelé par l'agent depuis le Dashboard React)
  @Put(':id/statut')
  async updateStatut(
    @Param('id') id: string,
    @Body('statut') statut: string,
  ) {
    const certificat_id = parseInt(id, 10);
    if (isNaN(certificat_id)) throw new BadRequestException('Invalid certificat_id');
    return this.certificatRepository.updateStatutDossier(certificat_id, statut);
  }


  // ✏️ UPDATE COMPLET (Mise à jour vers memoryStorage)
  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: "extrait", maxCount: 1 },
        { name: "parent_recto", maxCount: 1 },
        { name: "parent_verso", maxCount: 1 },
        { name: "recto_piece", maxCount: 1 },
        { name: "verso_piece", maxCount: 1 },
        { name: "acte_individuel", maxCount: 1 },
      ],
      { storage: memoryStorage() }, // Plus de diskStorage ici
    ),
  )
  async updateCertificat(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFiles() files: any,
  ) {
    const certificat_id = parseInt(id, 10);
    if (isNaN(certificat_id)) throw new BadRequestException('Invalid certificat_id');
    return this.certificatRepository.updateCertificat(certificat_id, body, files);
  }

  // ❌ DELETE
  @Delete(':id')
  async deleteCertificat(@Param('id') id: string) {
    const certificat_id = parseInt(id, 10);
    if (isNaN(certificat_id)) throw new BadRequestException('Invalid certificat_id');
    return this.certificatRepository.deleteCertificat(certificat_id);
  }
}