import { Inject, Injectable, NotFoundException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Login } from '../entities/login.entity';
import { CreateLoginDto } from '../Dtos/login.dtos';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';

@Injectable()
export class LoginService {
    constructor(
        @Inject('PG_POOL') private readonly db: Pool,
        @InjectRepository(Login) private readonly loginRepository: Repository<Login>,
        private readonly jwtService: JwtService,
    ) {}

    // 1. Inscription sécurisée
    async CreateLogin(loginDto: CreateLoginDto): Promise<Login> {
        const existing = await this.loginRepository.findOne({ where: { email: loginDto.email } });
        if (existing) {
            throw new ConflictException('Cet email est déjà utilisé.');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(loginDto.password, salt);
        
        const newLogin = this.loginRepository.create({
            ...loginDto,
            password: hashedPassword
        });
        return await this.loginRepository.save(newLogin);
    }

    // 2. Connexion et validation sécurisée
    async validateAndGenerateToken(user: { users_id: number; email: string; prenom: string; role: string }) {
        const payload = { 
            userId: user.users_id, 
            email: user.email,
            prenom: user.prenom,
            role: user.role 
        };

        const existingLogin = await this.loginRepository.findOne({ where: { email: user.email } });

        if (!existingLogin) {
            await this.loginRepository.save({ 
                email: user.email, 
                password: 'OAUTH_GOOGLE_SESSION' 
            });
        }

        return {
            access_token: this.jwtService.sign(payload),
            user: { id: user.users_id, prenom: user.prenom, email: user.email, role: user.role }
        };
    }

    // 3. Mot de passe oublié
    async forgotPassword(email: string) {
        const user = await this.loginRepository.findOne({ where: { email } });
        if (!user) throw new NotFoundException('Utilisateur introuvable');

        const token = Math.random().toString(36).substring(2, 15);
        user.resetPasswordToken = token;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 heure
        
        await this.loginRepository.save(user);
        return { message: "Token généré", token };
    }

    // 4. Réinitialisation effective
    async resetPassword(token: string, newPassword: string) {
        const user = await this.loginRepository.findOne({ where: { resetPasswordToken: token } });
        
        // Vérification de sécurité avec les types corrects
        if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
            throw new UnauthorizedException('Token invalide ou expiré');
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        
        // Nettoyage des champs avec undefined
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        
        await this.loginRepository.save(user);
        return { message: "Mot de passe mis à jour avec succès" };
    }

    async DeleteLogin(id_login: number): Promise<void> {
        const result = await this.loginRepository.delete(id_login);
        if (result.affected === 0) throw new NotFoundException('Login introuvable');
    }
}