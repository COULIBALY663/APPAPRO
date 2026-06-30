import { Controller, Post, Get, Body, Query, Res } from '@nestjs/common';
import { SupportService } from '../Services/message.service';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  // Vérification du Webhook (Meta)
  @Get('webhook')
  verifyWebhook(@Query('hub.mode') mode: string, @Query('hub.challenge') challenge: string, @Query('hub.verify_token') token: string, @Res() res) {
    if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
    return res.status(403).send('Forbidden');
  }

  // Réception des messages WhatsApp
  @Post('webhook')
  async handleIncomingMessage(@Body() body: any) {
    const entry = body.entry?.[0]?.changes?.[0]?.value;
    if (entry?.messages) {
      const { from, text } = entry.messages[0];
      await this.supportService.saveIncomingMessage(from, text.body);
    }
    return { status: 'ok' };
  }
}