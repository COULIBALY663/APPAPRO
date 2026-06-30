import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';

@Injectable()
export class SupportService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async saveIncomingMessage(sender: string, content: string) {
    return await this.messageRepository.save({
      sender: sender,
      receiver: 'SUPPORT',
      content: content,
      createdAt: new Date(),
    });
  }

  async getConversation(user1: string, user2: string) {
    return await this.messageRepository.find({
      where: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ],
      order: { createdAt: 'ASC' }
    });
  }
}