import { Controller, Post, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PushSubscription } from '../entities/push-subscription.entity';

@Controller('push')
export class PushController {
  constructor(
    @InjectRepository(PushSubscription)
    private readonly pushRepository: Repository<PushSubscription>,
  ) {}

  @Post('subscribe')
  async subscribe(@Body() subscription: any) {
    // 1. Vérifier si l'abonnement existe déjà pour éviter les doublons
    const existing = await this.pushRepository.findOne({ 
        where: { endpoint: subscription.endpoint } 
    });
    
    if (!existing) {
      return await this.pushRepository.save(subscription);
    }
    return { message: "Déjà abonné" };
  }
}