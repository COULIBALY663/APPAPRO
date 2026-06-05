import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 1. CONFIGURATION CORS ULTRA-PERMISSIVE CONTRE LES ERREURS DE PREFLIGHT NGROK
  app.enableCors({
    origin: '*', // Accepte absolument tout en développement
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization, ngrok-skip-browser-warning',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204, // Force le statut 204 (No Content) pour rassurer le navigateur
  });

  // 2. Augmenter les limites de taille (au cas où un fichier PDF lourd passe)
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // 3. Dossier statique pour tes uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(3000);
  console.log('🚀 NestJS prêt sur le port 3000 avec CORS configuré.');
}

bootstrap();