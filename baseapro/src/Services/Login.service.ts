import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ILoginRepository } from '../repository/login.repository';
import { CreateLoginDto } from '../Dtos/login.dtos';
import { Login } from '../models/login.model';
import { JwtService } from '@nestjs/jwt'; // 🚀 Module nécessaire pour générer le Token JWT
import { Pool } from 'pg';

@Injectable()
export class LoginService implements ILoginRepository {
    constructor(
        @Inject('PG_POOL')
        private readonly db: Pool,
        private readonly jwtService: JwtService, // 🚀 Injection du JwtService
    ) {}

    // Enregistre l'historique dans ta table SQL login (Ton code d'origine)
    async CreateLogin(loginDto: CreateLoginDto): Promise<Login> {
        const result = await this.db.query(
            `INSERT INTO login (email, password)
             VALUES ($1, $2)
             RETURNING *`,
            [loginDto.email, loginDto.password],
        );
        return result.rows[0];
    }

    // 🚀 NOUVELLE MÉTHODE COMPATIBLE : Crée le jeton de session et ajoute une ligne d'historique
    async validateAndGenerateToken(user: { users_id: number; email: string; prenom: string }) {
        // 1. Préparation du payload (les données publiques et sécurisées stockées dans le token)
        const payload = { 
            userId: user.users_id, 
            email: user.email,
            prenom: user.prenom 
        };

        // 2. Écrit une trace dans ta table `login` pour garder l'historique (comme ton fonctionnement d'origine)
        await this.CreateLogin({ 
            email: user.email, 
            password: 'OAUTH_GOOGLE_SESSION' 
        });

        // 3. Renvoie le token signé au contrôleur
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.users_id,
                prenom: user.prenom,
                email: user.email,
            }
        };
    }

    // Supprime un login de l'historique (Ton code d'origine)
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