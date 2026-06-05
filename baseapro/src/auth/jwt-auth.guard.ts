import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Token manquant');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Token invalide');
    }

    try {
      // Remplace 'SECRET_KEY' par ta clé secrète réelle
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SECRET_KEY') as any;
      // On attache les infos de l’utilisateur au req pour les controllers
      request['user'] = { email: decoded.email, id: decoded.sub };
      return true;
    } catch (err) {
      throw new UnauthorizedException('Token invalide ou expiré');
    }
  }
}
