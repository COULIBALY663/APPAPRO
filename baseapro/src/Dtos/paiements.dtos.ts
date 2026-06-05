import {
  IsString,
  IsNumber,
  IsOptional,
  IsObject,
} from "class-validator";

export class CreatePaiementDto {

  @IsString()
  telephone !: string;

  @IsNumber()
  montant !: number;

  @IsString()
  type_service !: string;

  @IsNumber() // 🔥 Ajouté pour autoriser le passage du certificat_id
  certificat_id !: number;

  @IsOptional()
  @IsObject()
  metadata?: any;
}