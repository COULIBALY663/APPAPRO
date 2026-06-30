import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Message } from '../entities/message.entity'; // À créer

@Injectable()
export class SupportService {
  private readonly apiUrl = `https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_ID}/messages`;
  private readonly token = process.env.WHATSAPP_TOKEN;

  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  // Envoyer un message vers WhatsApp
  async sendMessageToWhatsApp(to: string, text: string) {
    await axios.post(this.apiUrl, {
      messaging_product: 'whatsapp',
      to: to,
      type: 'text',
      text: { body: text }
    }, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
    
    // Sauvegarde de notre réponse en base
    return await this.messageRepository.save({
      sender: 'SUPPORT',
      receiver: to,
      content: text
    });
  }

  // Enregistrer le message entrant
  async saveIncomingMessage(from: string, text: string) {
    return await this.messageRepository.save({
      sender: from,
      receiver: 'SUPPORT',
      content: text
    });
  }
}