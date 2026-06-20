import { Injectable, NotFoundException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/users.entity'; // Import de la bonne entité
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

    // 2. Validation
    async validateAndGenerateToken(user: { users_id: number; email: string; prenom: string; role: string }) {
        const payload = { userId: user.users_id, email: user.email, prenom: user.prenom, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: { id: user.users_id, prenom: user.prenom, email: user.email, role: user.role }
        };
    }

    // 3. Demande d'OTP (Interroge table 'users')
    async requestOtp(email: string) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) throw new NotFoundException('Utilisateur introuvable');

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        user.resetPasswordToken = otp;
        user.resetPasswordExpires = new Date(Date.now() + 10 * 60000); 
        
        await this.userRepository.save(user);
        return { message: "Code OTP généré", otp };
    }

    // 4. Validation OTP (Mise à jour table 'users')
    async verifyOtpAndReset(email: string, otp: string, newPassword: string) {
        const user = await this.userRepository.findOne({ where: { email, resetPasswordToken: otp } });
        
        if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
            throw new UnauthorizedException('Code OTP invalide ou expiré');
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        
        await this.userRepository.save(user);
        return { message: "Mot de passe mis à jour avec succès" };
    }
    async DeleteLogin(id_login: number): Promise<void> {
    const result = await this.userRepository.delete(id_login);
    if (result.affected === 0) {
        throw new NotFoundException('Utilisateur introuvable');
    }
}
}
