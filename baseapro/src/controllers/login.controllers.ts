import { Controller, Get, Post, Delete, Body, Param, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { LoginService } from '../Services/Login.service';
import { UsersServices } from '../Services/users.services';
import { CreateLoginDto } from '../Dtos/login.dtos';
import { Login } from '../entities/login.entity';

@ApiTags('Login')
@Controller('login')
export class LoginController {

  constructor(
    private readonly loginService: LoginService,
    private readonly usersService: UsersServices,
  ) {}

  @Post()
  @ApiBody({ type: CreateLoginDto })
  @ApiResponse({ status: 201, description: 'Login créé', type: Login })
  async createLogin(@Body() data: CreateLoginDto) {
    return this.loginService.CreateLogin(data);
  }

  @Delete(':login_id')
  @ApiResponse({ status: 200, description: 'Login supprimé' })
  async deleteLogin(@Param('login_id') login_id: string) {
    const id = parseInt(login_id, 10);
    return this.loginService.DeleteLogin(id);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    try {
      const googleProfile = req.user;
      const userInDb = await this.usersService.findOrCreateGoogleUser(googleProfile);
      const session = await this.loginService.validateAndGenerateToken(userInDb); 

      const redirectUrl = process.env.FRONTEND_URL || 'https://apro-client.onrender.com';
      return res.redirect(`${redirectUrl}/dashboard?token=${session.access_token}`);
    } catch (error) {
      console.error("Erreur authentification Google :", error);
      const baseUrl = process.env.FRONTEND_URL || 'https://apro-client.onrender.com';
      return res.redirect(`${baseUrl}/?error=google_failed`);
    }
  }
}