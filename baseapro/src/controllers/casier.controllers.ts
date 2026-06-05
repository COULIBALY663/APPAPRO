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

import {
  ApiTags,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

import { CASIER_REPOSITORY } from '../repository/casier.repository';
import type { ICasierRepository } from '../repository/casier.repository';

import { CreateCasierDto } from 'src/Dtos/casier.dto';
import { casier } from '../models/casier.models';

@ApiTags('Casier')
@Controller('casier')
export class CasierController {
  constructor(
    @Inject(CASIER_REPOSITORY)
    private readonly casierRepository: ICasierRepository,
  ) { }

  // ➕ CREATE AVEC IMAGES
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'extrait', maxCount: 1 },
        { name: 'recto_piece', maxCount: 1 },
        { name: 'verso_piece', maxCount: 1 },
        { name: 'acte_individuel', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: join(process.cwd(), 'uploads'),
          filename: (req, file, callback) => {
            const uniqueName =
              Date.now() + '-' + Math.round(Math.random() * 1e9);

            callback(
              null,
              uniqueName + extname(file.originalname),
            );
          },
        }),
      },
    ),
  )
  @ApiBody({ type: CreateCasierDto })
  @ApiResponse({
    status: 201,
    description: 'Casier créé avec succès',
    type: casier,
  })
  async createCasier(
    @Body() body: CreateCasierDto,
    @UploadedFiles() files: any,
  ) {
    console.log('===== DEBUG CREATE =====');
    console.log('BODY:', body);
    console.log('FILES:', files);
    console.log('========================');

    return this.casierRepository.createCasier(
      body,
      files,
    );
  }

  // 📄 GET ALL
  @Get()
  async getAll() {
    return this.casierRepository.getAllCasiers();
  }

  // 🔍 GET BY ID
  @Get(':id')
  async findById(@Param('id') id: string) {
    const casier_id = parseInt(id, 10);

    if (isNaN(casier_id)) {
      throw new BadRequestException(
        'Invalid casier_id',
      );
    }

    return this.casierRepository.findByCasierId(
      casier_id,
    );
  }

  // ✏️ UPDATE
  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'extrait', maxCount: 1 },
        { name: 'recto_piece', maxCount: 1 },
        { name: 'verso_piece', maxCount: 1 },
        { name: 'acte_individuel', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: join(process.cwd(), 'uploads'),
          filename: (req, file, callback) => {
            const uniqueName =
              Date.now() + '-' + Math.round(Math.random() * 1e9);

            callback(
              null,
              uniqueName + extname(file.originalname),
            );
          },
        }),
      },
    ),
  )
  async updateCasier(
    @Param('id') id: string,
    @Body() body: CreateCasierDto,
    @UploadedFiles() files: any,
  ) {
    const casier_id = parseInt(id, 10);

    if (isNaN(casier_id)) {
      throw new BadRequestException(
        'Invalid casier_id',
      );
    }

    console.log('===== DEBUG UPDATE =====');
    console.log('BODY:', body);
    console.log('FILES:', files);
    console.log('========================');

    return this.casierRepository.updateCasier(
      casier_id,
      body,
      files,
    );
  }

  // ❌ DELETE
  @Delete(':id')
  async deleteCasier(
    @Param('id') id: string,
  ) {
    const casier_id = parseInt(id, 10);

    if (isNaN(casier_id)) {
      throw new BadRequestException(
        'Invalid casier_id',
      );
    }

    return this.casierRepository.deleteCasier(
      casier_id,
    );
  }
}