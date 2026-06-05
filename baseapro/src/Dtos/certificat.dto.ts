import { ApiProperty } from '@nestjs/swagger';

export class CreateCertificatDto {

  @ApiProperty({ example: "Coulibaly" })
  nom!: string;

  @ApiProperty({ example: "Moussa" })
  prenom!: string;

  @ApiProperty({ example: "0564225178" })
  telephone!: string;

  @ApiProperty({ example: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f" })
  extrait!: string;

  @ApiProperty({ example: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f" })
  parent_recto!: string;

  @ApiProperty({ example: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f" })
  parent_verso!: string;

  @ApiProperty({ example: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f" })
  recto_piece!: string;

  @ApiProperty({ example: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f" })
  verso_piece!: string;

  @ApiProperty({ example: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f" })
  acte_individuel!: string;
}

export class UpdateCertificatDto {

  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: "Coulibaly", required: false })
  nom?: string;

  @ApiProperty({ example: "Moussa", required: false })
  prenom?: string;

  @ApiProperty({ example: "0564225178", required: false })
  telephone?: string;

  @ApiProperty({ example: "https://images.unsplash.com/photo-new.jpg", required: false })
  extrait?: string;

  @ApiProperty({ example: "https://images.unsplash.com/photo-new.jpg", required: false })
  parent_recto?: string;

  @ApiProperty({ example: "https://images.unsplash.com/photo-new.jpg", required: false })
  parent_verso?: string;

  @ApiProperty({ example: "https://images.unsplash.com/photo-new.jpg", required: false })
  recto_piece?: string;

  @ApiProperty({ example: "https://images.unsplash.com/photo-new.jpg", required: false })
  verso_piece?: string;

  @ApiProperty({ example: "https://images.unsplash.com/photo-new.jpg", required: false })
  acte_individuel?: string;
}

export class DeleteCertificatDto {

  @ApiProperty({ example: 1 })
  id!: number;
}