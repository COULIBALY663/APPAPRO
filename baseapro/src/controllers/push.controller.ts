import { Controller, Post, Body, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PushSubscription } from '../entities/push-subscription.entity';
import * as webpush from 'web-push';

@Controller('push')
export class PushController {
  constructor(
    @InjectRepository(PushSubscription)
    private readonly pushRepository: Repository<PushSubscription>,
  ) {}

  @Post('subscribe')
  async subscribe(@Body() subscription: any) {
    console.log("Données reçues :", JSON.stringify(subscription));

    const existing = await this.pushRepository.findOne({
      where: { endpoint: subscription.endpoint },
    });

    if (!existing) {
      const newSubscription = this.pushRepository.create({
        endpoint: subscription.endpoint,
        keys: {
          auth: subscription.keys.auth,
          p256dh: subscription.keys.p256dh,
        },
      });

      return await this.pushRepository.save(newSubscription);
    }

    return { message: 'Déjà abonné' };
  }

  @Get('test-final')
  async testFinal() {
    const vapidDetails = {
      subject: 'mailto:ziec2061@gmail.com',
      publicKey: process.env.VAPID_PUBLIC_KEY!,
      privateKey: process.env.VAPID_PRIVATE_KEY!,
    };

    const sub = await this.pushRepository.findOne({
      where: {},
    });

    if (!sub) {
      return 'Aucun abonnement en base !';
    }

    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: sub.keys as any,
        },
        JSON.stringify({
          title: 'TEST',
          body: 'Si tu vois ça, le système fonctionne !',
        }),
        { vapidDetails },
      );

      return 'Envoi réussi ! Vérifiez votre écran.';
    } catch (err: any) {
      return {
        error: err.message,
        details: err,
      };
    }
  }
}