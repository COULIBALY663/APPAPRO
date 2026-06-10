import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const allowedOrigins = [
    process.env.FRONTEND_URL || 'https://dahboard.onrender.com' || 'https://apro-client.onrender.com',
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

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();