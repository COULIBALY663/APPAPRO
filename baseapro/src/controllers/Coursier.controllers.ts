import { 
  Controller, 
  Post, 
  Body, 
  Param, 
  UseInterceptors, 
  UploadedFiles, 
  BadRequestException, 
  HttpCode, 
  HttpStatus 
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CoursierService } from '../Services/Coursier.service';

@Controller('coursier')
export class CoursierController {
  
  constructor(private readonly coursierService: CoursierService) {}

  @Post(':paiementId')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "recto_piece", maxCount: 1 },
      { name: "verso_piece", maxCount: 1 },
    ], { storage: memoryStorage() }),
  )
  async create(
    @Param('paiementId') paiementId: string,
    @Body() body: any, 
    @UploadedFiles() files: { 
      recto_piece?: Express.Multer.File[],
      verso_piece?: Express.Multer.File[]
    }
  ) {
    const pId = parseInt(paiementId, 10);
    if (isNaN(pId)) {
      throw new BadRequestException('Le format du paiementId est invalide.');
    }

    // Validation des champs requis par votre entité
    if (!body.IP || !body.FILIERE || !body.nom || !body.date_nais || !body.Lieu_nais) {
      throw new BadRequestException('Veuillez remplir tous les champs obligatoires (IP, FILIERE, nom, date_nais, Lieu_nais).');
    }

    return await this.coursierService.createWithPaymentCheck(body, pId, files);
  }
}