// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UsersServices } from '../Services/users.services';

@Module({
  imports: [
    JwtModule.register({
      secret: 'SECRET_KEY', // change ça en variable d'environnement
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [JwtStrategy, UsersServices],
  exports: [JwtModule],
})
export class AuthModule {}
