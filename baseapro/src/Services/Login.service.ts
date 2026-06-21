import { Injectable, NotFoundException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/users.entity';
import { CreateLoginDto } from '../Dtos/login.dtos';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';

@Injectable()
export class LoginService {
    constructor(
        @InjectRepository(Users) private readonly userRepository: Repository<Users>,
        private readonly jwtService: JwtService,
    ) {}

    async CreateLogin(loginDto: CreateLoginDto): Promise<Users> {
        const existing = await this.userRepository.findOne({ where: { email: loginDto.email } });
        if (existing) throw new ConflictException('Cet email est déjà utilisé.');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(loginDto.password, salt);
        const newUser = this.userRepository.create({ ...loginDto, password: hashedPassword });
        return await this.userRepository.save(newUser);
    }

    async requestOtp(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    user.resetPasswordToken = otp;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60000); 
    await this.userRepository.save(user);

    try {
        // Tentative d'envoi d'e-mail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: '"Support Académie Pro" <votre-email@gmail.com>',
            to: email,
            subject: 'Code de réinitialisation',
            text: `Votre code OTP est : ${otp}. Il est valide pour 10 minutes.`
        });
        
        return { message: "Code OTP généré et envoyé par email", otp };
    } catch (error) {
        // En cas d'échec mail, on retourne quand même le code (pour vos tests)
        console.error("Erreur envoi mail :", error);
        return { message: "Code OTP généré (email non envoyé)", otp }; 
    }
  }
    async verifyOtpAndReset(email: string, otp: string, newPassword: string) {
        const user = await this.userRepository.findOne({ where: { email, resetPasswordToken: otp } });
        if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
            throw new UnauthorizedException('Code invalide ou expiré');
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await this.userRepository.save(user);
        return { message: "Mot de passe mis à jour" };
    }

    async DeleteLogin(users_id: number): Promise<void> {
        await this.userRepository.delete(users_id);
    }
}