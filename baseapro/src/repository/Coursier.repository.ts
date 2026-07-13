import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Coursier } from '../entities/coursier.entity';


@Injectable()
export class CoursierRepository {


  constructor(

    @InjectRepository(Coursier)
    private readonly repository: Repository<Coursier>,

  ) {}



  // Créer un coursier

  async create(
    data: Partial<Coursier>
  ): Promise<Coursier> {


    const coursier =
      this.repository.create(data);


    return await this.repository.save(
      coursier
    );

  }





  // Récupérer tous les coursiers

  async findAll(): Promise<Coursier[]> {


    return await this.repository.find({

      order: {

        id: 'DESC'

      },


      relations: [

        'paiement'

      ]

    });


  }





  // Trouver par ID

  async findById(
    id:number
  ): Promise<Coursier | null> {


    return await this.repository.findOne({

      where: {

        id

      },


      relations: [

        'paiement'

      ]

    });


  }





  // Modifier un coursier

  async update(
    id:number,
    data:Partial<Coursier>
  ): Promise<Coursier> {


    await this.repository.update(

      id,

      data

    );


    return await this.findById(id) as Coursier;


  }





  // Supprimer un coursier

  async delete(
    id:number
  ) {


    return await this.repository.delete(
      id
    );


  }





}