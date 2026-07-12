import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/users.entity';
import { CreateLoginDto } from '../Dtos/login.dtos';
import { JwtService } from '@nestjs/jwt';
import { UsersServices } from './users.services';
import * as bcrypt from 'bcrypt';

// @ts-ignore
const Brevo = require('@getbrevo/brevo');

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private readonly usersService: UsersServices,
    private readonly jwtService: JwtService,
  ) {}

  // ==========================
  // INSCRIPTION
  // ==========================
  async CreateLogin(loginDto: CreateLoginDto): Promise<Users> {
    const existing = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (existing) {
      throw new ConflictException('Cet email est déjà utilisé.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(loginDto.password, salt);

    const newUser = this.userRepository.create({
      ...loginDto,
      password: hashedPassword,
    });

    return await this.userRepository.save(newUser);
  }

  // ==========================
  // CONNEXION GOOGLE
  // ==========================
  async validateGoogleUser(googleUser: {
    email: string;
    prenom: string;
    nom: string;
  }) {
    const user = await this.usersService.findOrCreateGoogleUser(
      googleUser,
    );

    return this.validateAndGenerateToken(user);
  }

  // ==========================
  // CONNEXION CLASSIQUE
  // ==========================
 async Login(email: string, pass: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    // NOUVELLE RÈGLE : Vérification du rôle admin
    if (user.role !== 'admin') {
      throw new UnauthorizedException('Accès refusé : Seuls les administrateurs peuvent se connecter ici.');
    }

    const isMatch = await bcrypt.compare(pass, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Mot de passe incorrect');
    }

    return this.validateAndGenerateToken(user);
  }

  // ==========================
  // ENVOI OTP
  // ==========================
  async requestOtp(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetPasswordToken = otp;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);

    await this.userRepository.save(user);

    const apiInstance = new Brevo.TransactionalEmailsApi();

    apiInstance.setApiKey(
      Brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY,
    );

    const sendSmtpEmail = new Brevo.SendSmtpEmail();

    sendSmtpEmail.subject = 'Code de réinitialisation';

    sendSmtpEmail.sender = {
      name: 'Support Académie Pro',
      email: 'contact@academiepro.com',
    };

    sendSmtpEmail.to = [
      {
        email,
      },
    ];

    sendSmtpEmail.textContent = `Votre code OTP est : ${otp}. Il est valide pendant 10 minutes.`;

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    return {
      message: 'Code OTP envoyé.',
    };
  }

  // ==========================
  // VALIDATION OTP
  // ==========================
  async verifyOtpAndReset(
    email: string,
    otp: string,
    newPassword: string,
  ) {
    const user = await this.userRepository.findOne({
      where: {
        email: email.trim().toLowerCase(),
        resetPasswordToken: otp,
      },
    });

    if (
      !user ||
      !user.resetPasswordExpires ||
      user.resetPasswordExpires < new Date()
    ) {
      throw new UnauthorizedException(
        'Code invalide ou expiré',
      );
    }

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await this.userRepository.save(user);

    return {
      message: 'Mot de passe mis à jour',
    };
  }

  // ==========================
  // SUPPRESSION
  // ==========================
  async DeleteLogin(users_id: number): Promise<void> {
    await this.userRepository.delete(users_id);
  }

  // ==========================
  // JWT
  // ==========================
  async validateAndGenerateToken(user: Users) {
    const payload = {
      email: user.email,
      sub: user.users_id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}