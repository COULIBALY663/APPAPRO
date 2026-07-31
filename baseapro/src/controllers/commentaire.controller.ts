import {
  Body,
  Controller,
 Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";

import { CommentaireService } from "../Services/commentaire.service";
import { CreateCommentaireDto } from "../Dtos/create-commentaire.dto";

@Controller("commentaires")
export class CommentaireController {
  constructor(
    private readonly commentaireService: CommentaireService,
  ) {}

  @Post()
  create(@Body() dto: CreateCommentaireDto) {
    return this.commentaireService.create(dto);
  }

  @Get()
  findAll() {
    return this.commentaireService.findAll();
  }

  @Delete(":id")
  delete(@Param("id") id: number) {
    return this.commentaireService.delete(Number(id));
  }

  @Patch(":id/reponse")
  repondre(
    @Param("id") id: number,
    @Body("reponse") reponse: string,
  ) {
    return this.commentaireService.repondre(Number(id), reponse);
  }
}