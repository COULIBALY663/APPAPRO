import { Injectable, NotFoundException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/users.entity';
import { CreateLoginDto } from '../Dtos/login.dtos';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoginService {
    constructor(
        @InjectRepository(Users) private readonly userRepository: Repository<Users>,
        private readonly jwtService: JwtService,
    ) {}

    // 1. Inscription
    async CreateLogin(loginDto: CreateLoginDto): Promise<Users> {
        const existing = await this.userRepository.findOne({ where: { email: loginDto.email } });
        if (existing) throw new ConflictException('Cet email est déjà utilisé.');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(loginDto.password, salt);
        
        const newUser = this.userRepository.create({ ...loginDto, password: hashedPassword });
        return await this.userRepository.save(newUser);
    }

    // 2. Validation et génération de token (pour le login normal)
    async validateAndGenerateToken(user: { users_id: number; email: string; prenom: string; role: string }) {
        const payload = { userId: user.users_id, email: user.email, prenom: user.prenom, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: { id: user.users_id, prenom: user.prenom, email: user.email, role: user.role }
        };
    }

    // 3. Demande d'OTP (Génération et stockage dans la table 'users')
    async requestOtp(email: string) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) throw new NotFoundException('Utilisateur introuvable');

        // Génération d'un code OTP à 6 chiffres
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        user.resetPasswordToken = otp;
        user.resetPasswordExpires = new Date(Date.now() + 10 * 60000); // Expiration dans 10 min
        
        await this.userRepository.save(user);
        
        // Note: Ici vous devriez ajouter l'envoi d'email via Nodemailer
        return { message: "Code OTP généré avec succès", otp }; 
    }

    // 4. Validation OTP et réinitialisation du mot de passe
    async verifyOtpAndReset(email: string, otp: string, newPassword: string) {
        const user = await this.userRepository.findOne({ where: { email, resetPasswordToken: otp } });
        
        // Vérification de l'existence et de l'expiration
        if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
            throw new UnauthorizedException('Code OTP invalide ou expiré');
        }

        // Hachage du nouveau mot de passe
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        
        // Nettoyage des champs de récupération
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        
        await this.userRepository.save(user);
        return { message: "Mot de passe mis à jour avec succès" };
    }

    // 5. Suppression d'utilisateur
    async DeleteLogin(users_id: number): Promise<void> {
        const result = await this.userRepository.delete(users_id);
        if (result.affected === 0) {
            throw new NotFoundException('Utilisateur introuvable');
        }
    }
}