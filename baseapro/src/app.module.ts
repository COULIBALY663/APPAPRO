import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './Database/pg.module';
import { JwtModule } from '@nestjs/jwt';

// === ENTITÉS ===
import { Users } from './entities/users.entity';
import { Casier } from './entities/casier.entity';
import { Certificat } from './entities/certificat.entity';
import { Paiement } from './entities/paiement.entity';
import { Message } from './entities/message.entity';

// === SERVICES & CONTROLLERS ===
import { UsersServices } from './Services/users.services';
import { UsersController } from './controllers/users.controllers';
import { IUsersRepository } from './repository/users.repository';

import { LoginService } from './Services/Login.service';
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
import { AppController } from './app.controller';

// === SUPPORT (WhatsApp) ===
import { SupportController } from './controllers/support.controllers';
import { SupportService } from './Services/message.service';
import { NotificationGateway } from './notification.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'CLE_SECRET_PROVISOIRE_ACADEMIE_PRO_2026',
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([
      Paiement,
      Users,
      Certificat,
      Casier,
      Message, // ✅ Entité ajoutée
    ]),
  ],

  controllers: [
    AppController,
    UsersController,
    CasierController,
    CertificatController,
    PaiementController,
    LoginController,
    SupportController, // ✅ Contrôleur ajouté
  ],

  providers: [
    LoginService,
    UsersServices,
    CasierService,
    CertificatService,
    PaiementService,
    SupportService, // ✅ Service ajouté
    PaiementRepository,
    GoogleStrategy,
    NotificationGateway, // ✅ Gateway ajoutée

    // Déclaration des interfaces (alias)
    { provide: IUsersRepository, useClass: UsersServices },
    { provide: CASIER_REPOSITORY, useClass: CasierService },
    { provide: CERTIFICAT_REPOSITORY, useClass: CertificatService },
  ],
})
export class AppModule {}