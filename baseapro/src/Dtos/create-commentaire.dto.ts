import {
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from "class-validator";

export class CreateCommentaireDto {
  @IsString()
  @IsNotEmpty()
  nom!: string;

  @IsString()
  @IsNotEmpty()
  commentaire!: string;

  @IsInt()
  @Min(1)
  @Max(5)
  note!: number;
}