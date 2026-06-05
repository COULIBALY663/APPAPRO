import { ApiProperty } from "@nestjs/swagger";

export class CreateUsersDto {
    @ApiProperty({
      example: 'john.doe@gmail.com',
      description: 'Email de l’utilisateur',
    })
    email!: string;
  
    @ApiProperty({
      example: '12345678',
      description: 'Mot de passe en clair avant hashage',
    })
    password!: string;
    @ApiProperty({
      example: 'COULIBALY',
      description: 'nom de l’utilisateur',
    })
    nom!: string;
  @ApiProperty({
    example: 'ZIE',
    description: 'prenom de l’utilisateur',
  })
  prenom!: string;
}
  
  export class UpdateUsersDto {
    @ApiProperty({
      example: 1,
      required: false,
      description: 'ID de l’utilisateur à mettre à jour',
    })
    users_id?: number;
  
    @ApiProperty({
      example: 'new.email@gmail.com',
      required: false,
      description: 'Nouvel email',
    })
    email?: string;
  
    @ApiProperty({
      example: 'newpassword123',
      required: false,
      description: 'Nouveau mot de passe avant hashage',
    })
    password?: string;
    @ApiProperty({
      example: 'ZIE',
      required: false,
      description: 'Nouveau prénom de l’utilisateur',
  })
  prenom?: string;
  @ApiProperty({
    example: 'COULIBALY',
    required: false,
    description: 'Nouveau nom de l’utilisateur',
})
nom?: string; 
  }
  export class DeleteUsersDto {
    @ApiProperty({
      example: 1,
      description: 'ID de l’utilisateur à supprimer',
    })
    users_id!: number;
  }
  export class FindUsersByIdDto {
    @ApiProperty({
      example: 1,
      description: "ID de l’utilisateur à rechercher",
    })
    users_id!: number;
  }

