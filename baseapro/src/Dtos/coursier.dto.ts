import { IsString, IsNotEmpty, IsDateString, IsOptional, IsNumber } from 'class-validator';

export class CreateCoursierDto {
  @IsString()
  @IsNotEmpty({ message: 'L\'adresse IP est obligatoire' })
  IP!: string;

  @IsString()
  @IsNotEmpty({ message: 'La filière est obligatoire' })
  FILIERE!: string;

  @IsString()
  @IsNotEmpty({ message: 'Le nom est obligatoire' })
  nom!: string;

  @IsDateString()
  @IsNotEmpty({ message: 'La date de naissance est obligatoire' })
  date_nais!: Date;

  @IsString()
  @IsNotEmpty({ message: 'Le lieu de naissance est obligatoire' })
  Lieu_nais!: string;

  @IsString()
  @IsOptional()
  telephone?: string;

  @IsString()
  @IsOptional()
  recto?: string;

  @IsString()
  @IsOptional()
  verso?: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Le paiementId est nécessaire pour valider l\'enregistrement' })
  paiementId!: number;
}