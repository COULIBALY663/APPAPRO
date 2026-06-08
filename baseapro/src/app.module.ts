import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './Database/pg.module';
import { JwtModule } from '@nestjs/jwt'; 

// === ENTITÉS (MODELS) ===
import { Users } from './entities/users.entity'; // <-- IMPORTANT: Importez vos entités ici
import { Login } from './entities/login.entity';
import { Casier } from './entities/casier.entity';
import { Certificat } from './entities/certificat.entity';
import { Paiement } from './entities/paiement.entity';

// === SERVICES & CONTROLLERS ===
import { UsersServices } from './Services/users.services';
import { UsersController } from './controllers/users.controllers';
import { IUsersRepository } from './repository/users.repository';

import { LoginService } from './Services/Login.service';
import { ILoginRepository } from './repository/login.repository';
import { LoginController } from './controllers/login.controllers';
import { GoogleStrategy } from './Services/google.strategy';

import { CasierController } from './controllers/casier.controllers';
import { CASIER_REPOSITORY } from './repository/casier.repository';
import { CasierService } from './Services/casier.service';

import { CertificatController } from './controllers/certificat.controllers';
import { CERTIFICAT_REPOSITORY } from './repository/Certificat.repository';
import { CertificatService } from './Services/Certificat.service';

import { PaiementController } from './controllers/paiement.controllers'; 
import { PaiementRepository } from './repository/paiement.repository'; 
import { PaiementService } from './Services/paiement.service'; 

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.production',
      isGlobal: true
    }),
    DatabaseModule,
    
    JwtModule.register({
      global: true, 
      secret: process.env.JWT_SECRET || 'CLE_SECRET_PROVISOIRE_ACADEMIE_PRO_2026',
      signOptions: { expiresIn: '1d' }, 
    }),

    // Liste corrigée de toutes les entités
    TypeOrmModule.forFeature([Paiement, Users, Certificat, Login, Casier]),
  ],

  controllers: [
    UsersController,
    LoginController,
    CasierController,
    CertificatController, 
    PaiementController,    
  ],

  providers: [
    { provide: IUsersRepository, useClass: UsersServices },
    { provide: ILoginRepository, useClass: LoginService },
    { provide: CASIER_REPOSITORY, useClass: CasierService },
    { provide: CERTIFICAT_REPOSITORY, useClass: CertificatService },
    PaiementRepository,
    PaiementService,
    GoogleStrategy,
  ],
})
export class AppModule { }