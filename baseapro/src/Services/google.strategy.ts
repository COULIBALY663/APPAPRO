import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      // 💡 On ajoute || '' pour garantir à TypeScript qu'une chaîne de caractères sera toujours fournie
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') || '',
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') || '',
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL') || 'https://appapro.onrender.com/login/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails } = profile;
    const user = {
      email: emails[0].value,
      prenom: name.givenName,
      nom: name.familyName,
    };
    done(null, user);
  }
}