import { Injectable, NotFoundException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/users.entity';
import { CreateLoginDto } from '../Dtos/login.dtos';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

// Importation propre du SDK Brevo
const Brevo = require('@getbrevo/brevo');

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

    async Login(email: string, pass: string) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) throw new NotFoundException('Utilisateur introuvable');
        
        const isMatch = await bcrypt.compare(pass, user.password);
        if (!isMatch) throw new UnauthorizedException('Mot de passe incorrect');
        return this.validateAndGenerateToken(user);
    }

    async requestOtp(email: string) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) throw new NotFoundException('Utilisateur introuvable');
        
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordToken = otp;
        user.resetPasswordExpires = new Date(Date.now() + 10 * 60000); 
        await this.userRepository.save(user);

        // Instanciation correcte avec le SDK Brevo
        const apiInstance = new Brevo.TransactionalEmailsApi();
        apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

        const sendSmtpEmail = new Brevo.SendSmtpEmail();
        sendSmtpEmail.subject = "Code de réinitialisation";
        sendSmtpEmail.sender = { "name": "Support Académie Pro", "email": "contact@academiepro.com" };
        sendSmtpEmail.to = [{ "email": email }];
        sendSmtpEmail.textContent = `Votre code OTP est : ${otp}. Il est valide pour 10 minutes.`;

        try {
            await apiInstance.sendTransacEmail(sendSmtpEmail);
            return { message: "Code OTP envoyé via API Brevo" };
        } catch (error) {
            console.error("Erreur API Brevo :", error);
            throw new Error("Impossible d'envoyer l'email.");
        }
    }

   async verifyOtpAndReset(email: string, otp: string, newPassword: string) {
        const user = await this.userRepository.findOne({ where: { email, resetPasswordToken: otp } });
        if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
            throw new UnauthorizedException('Code invalide ou expiré');
        }
        
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        
        // Remplacement de null par undefined pour respecter le typage de votre entité
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        
        await this.userRepository.save(user);
        return { message: "Mot de passe mis à jour" };
    }

    async DeleteLogin(users_id: number): Promise<void> {
        await this.userRepository.delete(users_id);
    }

    async validateAndGenerateToken(user: Users) {
        const payload = { email: user.email, sub: user.users_id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}