import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { IUsersRepository } from '../repository/users.repository';
import { CreateUsersDto, UpdateUsersDto } from '../Dtos/users.dtos';
import { users } from '../models/users.models';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersServices implements IUsersRepository {

  constructor(
    @Inject('PG_POOL')
    private readonly db: Pool,
  ) {}

  async findByUsersId(users_id: number): Promise<users | null> {
    const result = await this.db.query(
      'SELECT * FROM users WHERE users_id = $1',
      [users_id],
    );
    return result.rows[0] || null;
  }

  async findByEmail(email: string): Promise<users | null> {
    const result = await this.db.query(
      'SELECT * FROM users WHERE email = $1',
      [email],
    );
    return result.rows[0] || null;
  }

  async createUsers(data: CreateUsersDto): Promise<users> {

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const result = await this.db.query(
      `INSERT INTO users (prenom, nom, email, password)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.prenom, data.nom, data.email, hashedPassword],
    );

    return result.rows[0];
  }

  async getAllUsers(): Promise<users[]> {
    const result = await this.db.query(
      'SELECT * FROM users ORDER BY users_id ASC'
    );
    return result.rows;
  }

  async updateUsers(users_id: number, data: UpdateUsersDto): Promise<users | null> {

    let hashedPassword = data.password;

    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(data.password, salt);
    }

    const result = await this.db.query(
      `UPDATE users
       SET prenom = $1,
           nom = $2,
           email = $3,
           password = $4
       WHERE users_id = $5
       RETURNING *`,
      [
        data.prenom,
        data.nom,
        data.email,
        hashedPassword,
        users_id,
      ],
    );

    return result.rows[0] || null;
  }

  async deleteUsers(users_id: number): Promise<boolean> {
    const result = await this.db.query(
      'DELETE FROM users WHERE users_id = $1',
      [users_id],
    );

    return (result.rowCount ?? 0) > 0;
  }

}
