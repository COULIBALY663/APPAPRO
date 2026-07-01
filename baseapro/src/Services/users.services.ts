import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { IUsersRepository } from '../repository/users.repository';
import { CreateUsersDto, UpdateUsersDto } from '../Dtos/users.dtos';
import { Users } from '../entities/users.entity'; // 🚀 IMPORT CORRIGÉ

@Injectable()
export class UsersServices implements IUsersRepository {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async findByUsersId(users_id: number): Promise<Users | null> {
    return await this.usersRepository.findOne({ where: { users_id } });
  }

  async findByEmail(email: string): Promise<Users | null> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async createUsers(data: CreateUsersDto): Promise<Users> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const newUser = this.usersRepository.create({
      ...data,
      password: hashedPassword,
    });
    return await this.usersRepository.save(newUser);
  }

  async findOrCreateGoogleUser(googleUser: { email: string; prenom: string; nom: string }): Promise<Users> {
    const userExists = await this.findByEmail(googleUser.email);
    if (userExists) return userExists;

    const salt = await bcrypt.genSalt(10);
    const placeholderPassword = await bcrypt.hash(`GOOGLE_AUTH_SECURE_${Math.random()}`, salt);

    const newUser = this.usersRepository.create({
      ...googleUser,
      password: placeholderPassword,
    });
    return await this.usersRepository.save(newUser);
  }

  async getAllUsers(): Promise<Users[]> {
    return await this.usersRepository.find({ order: { users_id: 'ASC' } });
  }

  async updateUsers(users_id: number, data: UpdateUsersDto): Promise<Users | null> {
    let hashedPassword = data.password;
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(data.password, salt);
    }

    await this.usersRepository.update(users_id, {
      ...data,
      ...(hashedPassword && { password: hashedPassword }),
    });

    return await this.findByUsersId(users_id);
  }

  async deleteUsers(users_id: number): Promise<boolean> {
    const result = await this.usersRepository.delete(users_id);
    return (result.affected ?? 0) > 0;
  }
  
}