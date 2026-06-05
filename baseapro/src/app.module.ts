import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './Database/pg.module';

// === USERS ===
import { UsersServices } from './Services/users.services';
import { UsersController } from './controllers/users.controllers';
import { IUsersRepository } from './repository/users.repository';

// === LOGIN / AUTH ===
import { LoginService } from './Services/Login.service';
import { ILoginRepository } from './repository/login.repository';
import { LoginController } from './controllers/login.controllers';

// === CASIER JUDICIAIRE ===
import { CasierController } from './controllers/casier.controllers';
import { CASIER_REPOSITORY } from './repository/casier.repository';
import { CasierService } from './Services/casier.service';

// === CERTIFICAT ===
import { CertificatController } from './controllers/certificat.controllers';
import { CERTIFICAT_REPOSITORY } from './repository/Certificat.repository';
import { CertificatService } from './Services/Certificat.service';

// === PAIEMENT ===
// 💡 Les chemins ont été ajustés pour pointer directement vers tes dossiers existants
import { Paiement } from './entities/paiement.entity'; 
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
    
    // On charge l'entité Paiement dans TypeORM directement ici
    TypeOrmModule.forFeature([Paiement]),
  ],

  controllers: [
    UsersController,
    LoginController,
    CasierController,
    CertificatController, 
    PaiementController,   
  ],

  providers: [
    // --- Configuration Users ---
    {
      provide: IUsersRepository,
      useClass: UsersServices,
    },

    // --- Configuration Login ---
    {
      provide: ILoginRepository,
      useClass: LoginService,
    },

    // --- Configuration Casier ---
    {
      provide: CASIER_REPOSITORY,
      useClass: CasierService,
    },

    // --- Configuration Certificat ---
    {
      provide: CERTIFICAT_REPOSITORY,
      useClass: CertificatService,
    },

    // --- Configuration Paiement ---
    PaiementRepository,
    PaiementService,
  ],
})
export class AppModule { }