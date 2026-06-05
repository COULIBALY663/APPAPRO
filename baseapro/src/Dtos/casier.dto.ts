import {ApiProperty} from'@nestjs/swagger';

export class CreateCasierDto {

@ApiProperty({example:"Moussa"})
prenom!:string;

@ApiProperty({example:"0574557345"})
telephone!:string;

@ApiProperty({example:"https://images.unsplash.com/photo-1589829545856-d10d557cf95f"})
extrait!:string;

@ApiProperty({example:"https://images.unsplash.com/photo-1589829545856-d10d557cf95f"})
recto_piece!:string;

@ApiProperty({example:"https//images.unsplash.com/photo-1589829545856-d10d557cf95f"})
verso_piece!:string;

@ApiProperty({example:"https://images.unsplash.com/photo-1589829545856-d10d557cf95f"})
acte_individuel!:string;

}

export class UpdateCasierDto{

@ApiProperty({example:1})
id!:number;

@ApiProperty({example:"Kone",required:false})
nom!:string;

@ApiProperty({example:"Moussa",required:false})
prenm!:string;

@ApiProperty({example:"0574557345",required:false})
telephone!:string;

@ApiProperty({example:"https://images.unsplash.com/photo-new.jpg",required:false})
extrait!:string;

@ApiProperty({example:"https://images.unsplash.com/photo-new.jpg",required:false})
recto_piece!:string;

@ApiProperty({example:"https://images.unsplash.com/photo-new.jpg",required:false})
verso_piece!:string;

@ApiProperty({example:"https://images.unsplash.com/photo-new.jpg",required:false})
ate_individuel!:string;

}

export class DeleteCasierDto{
    
@ApiProperty({example:1})
id!:number;

}
