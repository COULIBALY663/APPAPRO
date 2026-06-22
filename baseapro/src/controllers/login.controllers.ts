import { Controller, Post, Delete, Body, Param, Req, Res, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { LoginService } from '../Services/Login.service';
import { UsersServices } from '../Services/users.services';
import { CreateLoginDto } from '../Dtos/login.dtos';
import { Users } from '../entities/users.entity'; // ✅ Import de l'entité Users

@ApiTags('Login')
@Controller('login')
export class LoginController {

  constructor(
    private readonly loginService: LoginService,
    private readonly usersService: UsersServices,
  ) {}

  @Post()
  @ApiBody({ type: CreateLoginDto })
  // ✅ Mise à jour du type de réponse vers Users
  @ApiResponse({ status: 201, description: 'Utilisateur créé', type: Users })
  async createLogin(@Body() data: CreateLoginDto) {
    return this.loginService.CreateLogin(data);
  }

  @Post('request-otp')
  @ApiResponse({ status: 200, description: 'Code OTP envoyé' })
  async requestOtp(@Body('email') email: string) {
    return await this.loginService.requestOtp(email);
  }

  @Post('verify-otp')
  @ApiResponse({ status: 200, description: 'Mot de passe réinitialisé' })
  async verifyOtp(@Body() body: { email: string; otp: string; newPassword: string }) {
    return await this.loginService.verifyOtpAndReset(body.email, body.otp, body.newPassword);
  }

 @Delete(':users_id') // Modification ici pour refléter l'ID de la table 'users'
  @ApiResponse({ status: 200, description: 'Utilisateur supprimé' })
  async deleteLogin(@Param('users_id') users_id: string) {
    return this.loginService.DeleteLogin(parseInt(users_id, 10));
  }
  @Post('connexion')
  @ApiResponse({ status: 200, description: 'Connexion réussie' })
  async login(@Body() loginDto: CreateLoginDto) {
    return this.loginService.Login(loginDto.email, loginDto.password);
  }
}