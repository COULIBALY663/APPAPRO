import { Injectable, NotFoundException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/users.entity';
import { CreateLoginDto } from '../Dtos/login.dtos';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer'; // <--- Import ajouté

@Injectable()
export class LoginService {
    constructor(
        @InjectRepository(Users) private readonly userRepository: Repository<Users>,
        private readonly jwtService: JwtService,
    ) {}

    // ... (Gardez vos méthodes CreateLogin, validateAndGenerateToken, verifyOtpAndReset, DeleteLogin)

    async requestOtp(email: string) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) throw new NotFoundException('Utilisateur introuvable');

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        user.resetPasswordToken = otp;
        user.resetPasswordExpires = new Date(Date.now() + 10 * 60000); 
        await this.userRepository.save(user);

        // CONFIGURATION DU MAILER
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Configurez ceci sur Render
                pass: process.env.EMAIL_PASS  // "Mot de passe d'application"
            }
        });

        // ENVOI DE L'EMAIL
        await transporter.sendMail({
            from: '"Support Académie Pro" <votre-email@gmail.com>',
            to: email,
            subject: 'Code de réinitialisation',
            text: `Votre code OTP est : ${otp}. Il expire dans 10 minutes.`
        });

        return { message: "Code OTP envoyé avec succès" }; 
    }
    
    // ... reste de votre classe
}