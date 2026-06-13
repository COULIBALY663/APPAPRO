import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ILoginRepository } from '../repository/login.repository';
import { CreateLoginDto } from '../Dtos/login.dtos';
import { Login } from '../entities/login.entity';
import { JwtService } from '@nestjs/jwt';
import { Pool } from 'pg';

@Injectable()
export class LoginService implements ILoginRepository {
    constructor(
        @Inject('PG_POOL')
        private readonly db: Pool,
        
        @InjectRepository(Login)
        private readonly loginRepository: Repository<Login>,
        
        private readonly jwtService: JwtService,
    ) {}

    async CreateLogin(loginDto: CreateLoginDto): Promise<Login> {
        const newLogin = this.loginRepository.create(loginDto);
        return await this.loginRepository.save(newLogin);
    }

    // 🚀 MODIFICATION ICI : On reçoit l'objet 'user' complet qui contient 'role'
    async validateAndGenerateToken(user: { users_id: number; email: string; prenom: string; role: string }) {
        const payload = { 
            userId: user.users_id, 
            email: user.email,
            prenom: user.prenom,
            role: user.role // ⬅️ On ajoute le rôle dans le Token JWT
        };

        await this.CreateLogin({ 
            email: user.email, 
            password: 'OAUTH_GOOGLE_SESSION' 
        });

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.users_id,
                prenom: user.prenom,
                email: user.email,
                role: user.role // ⬅️ On renvoie le rôle aussi ici
            }
        };
    }

    async DeleteLogin(id_login: number): Promise<void> {
        const result = await this.loginRepository.delete(id_login);
        if (result.affected === 0) {
            throw new NotFoundException('Login introuvable');
        }
    }
}