import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Commentaire } from "../entities/commentaire.entity";
import { CreateCommentaireDto } from "../Dtos/create-commentaire.dto";

@Injectable()
export class CommentaireService {
  constructor(
    @InjectRepository(Commentaire)
    private readonly commentaireRepository: Repository<Commentaire>,
  ) {}

  async create(dto: CreateCommentaireDto) {
    const commentaire = this.commentaireRepository.create(dto);

    return await this.commentaireRepository.save(commentaire);
  }

  async findAll() {
    return await this.commentaireRepository.find({
      where: {
        actif: true,
      },
      order: {
        createdAt: "DESC",
      },
    });
  }

  async delete(id: number) {
    const commentaire = await this.commentaireRepository.findOne({
      where: { id },
    });

    if (!commentaire) {
      throw new NotFoundException("Commentaire introuvable");
    }

    await this.commentaireRepository.remove(commentaire);
  }

  async repondre(id: number, reponse: string) {
    const commentaire = await this.commentaireRepository.findOne({
      where: { id },
    });

    if (!commentaire) {
      throw new NotFoundException("Commentaire introuvable");
    }

    commentaire.reponseAdmin = reponse;

    return await this.commentaireRepository.save(commentaire);
  }
}