import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class CreateLoginDto {
    @ApiProperty({ example: "moussaouattara@gmail.com" })
    @IsEmail({}, { message: "Format d'email invalide" })
    email!: string;

    @ApiProperty({ example: "12345678" })
    @IsNotEmpty()
    @MinLength(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
    password!: string;
}