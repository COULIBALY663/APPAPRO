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
        if (existing) throw new ConflictException('Cet email est déjà utilisé.');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(loginDto.password, salt);
        
        const newLogin = this.loginRepository.create({ ...loginDto, password: hashedPassword });
        return await this.loginRepository.save(newLogin);
    }

    // 2. Validation et génération de jeton (Rectification de l'erreur TS2339)
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

    // 3. Demande d'OTP
    async requestOtp(email: string) {
        const user = await this.loginRepository.findOne({ where: { email } });
        if (!user) throw new NotFoundException('Utilisateur introuvable');

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        user.resetPasswordToken = otp;
        user.resetPasswordExpires = new Date(Date.now() + 10 * 60000); 
        
        await this.loginRepository.save(user);
        return { message: "Code OTP généré", otp };
    }

    // 4. Validation OTP (Rectification de l'erreur TS2322 avec undefined)
    async verifyOtpAndReset(email: string, otp: string, newPassword: string) {
        const user = await this.loginRepository.findOne({ where: { email, resetPasswordToken: otp } });
        
        if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
            throw new UnauthorizedException('Code OTP invalide ou expiré');
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        
        // Nettoyage avec undefined (au lieu de null pour respecter le typage)
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