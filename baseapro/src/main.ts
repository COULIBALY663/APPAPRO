import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  // 1. Création de l'instance 'app' ICI
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 2. Configuration CORS sécurisée
  const allowedOrigins = [
    process.env.FRONTEND_URL || 'https://dahboard.onrender.com',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 3. Configuration des limites et dossiers statiques
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // 4. Lancement de l'application
  await app.listen(process.env.PORT || 3000);
  console.log('🚀 NestJS prêt sur le port 3000 avec CORS configuré.');
}

// 5. Appel de la fonction bootstrap
bootstrap();