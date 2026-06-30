import { Message } from '../entities/message.entity';

export const MESSAGE_REPOSITORY = 'MESSAGE_REPOSITORY';

export interface IMessageRepository {
  save(message: Partial<Message>): Promise<Message>;
  findAllBySender(sender: string): Promise<Message[]>;
  getLastMessages(limit: number): Promise<Message[]>;
}