import { Controller, Get } from '@nestjs/common';

// 1. Contrôleur global pour la santé de l'application
@Controller()
export class AppController {
  @Get('health')
  checkHealth() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}