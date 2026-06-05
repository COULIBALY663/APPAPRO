import{Inject, Injectable, NotFoundException} from '@nestjs/common';
import { ILoginRepository } from '../repository/login.repository';
import { CreateLoginDto } from '../Dtos/login.dtos';
import { Login } from '../models/login.model';
import {Pool} from 'pg';
@Injectable()
export class LoginService implements ILoginRepository {
    constructor(
        @Inject('PG_POOL')
        private readonly db: Pool,
    ) {}
    async CreateLogin(loginDto: CreateLoginDto): Promise<Login> {
        const result = await this.db.query(
            `INSERT INTO login ( email, password)
             VALUES ($1, $2)
                RETURNING *`,
            [loginDto.email, loginDto.password],)
        return result.rows[0];
    }
    async DeleteLogin(id_login: number): Promise<void> {
       const result = await this.db.query(
            `DELETE FROM login WHERE id_login = $1 returning *`,
        
            [id_login],
        );
        if (result.rowCount === 0) {
            throw new NotFoundException('Login introuvable');
        }
    }
}