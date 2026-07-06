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
  // 1. Log pour voir ce que vous recevez réellement (TRÈS IMPORTANT)
  console.log("Données reçues :", JSON.stringify(subscription));

  // 2. Vérifier si l'endpoint existe
  const existing = await this.pushRepository.findOne({ 
      where: { endpoint: subscription.endpoint } 
  });
  
  if (!existing) {
    // 3. Création explicite avec la structure attendue par l'entité
    const newSubscription = this.pushRepository.create({
      endpoint: subscription.endpoint,
      keys: {
        auth: subscription.keys.auth,
        p256dh: subscription.keys.p256dh
      }
    });
    
    return await this.pushRepository.save(newSubscription);
  }
  
  return { message: "Déjà abonné" };
}
}