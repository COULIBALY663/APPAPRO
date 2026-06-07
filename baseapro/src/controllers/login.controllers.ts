import { 
  Controller, Get, Post, Delete, Body, Param, Req, Res, UseGuards, Inject 
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ILoginRepository } from '../repository/login.repository';
import { IUsersRepository } from '../repository/users.repository'; // 🚀 Ajout pour lier la table users
import { Login } from '../models/login.model';
import { CreateLoginDto } from '../Dtos/login.dtos';

@ApiTags('Login')
@Controller('login') // On garde /login pour ne pas casser tes autres liaisons
export class LoginController {

  constructor(
    @Inject(ILoginRepository)
    private readonly loginRepository: ILoginRepository,

    @Inject(IUsersRepository)
    private readonly usersRepository: IUsersRepository, // 🚀 Injection du dépôt utilisateur
  ) {}

  // --- TES FONCTIONS D'ORIGINE ---

  @Post()
  @ApiBody({ type: CreateLoginDto })
  @ApiResponse({ status: 201, description: 'Login créé', type: Login })
  async createLogin(@Body() data: CreateLoginDto) {
    return this.loginRepository.CreateLogin(data);
  }

  @Delete(':login_id')
  @ApiResponse({ status: 200, description: 'Login supprimé' })
  async deleteLogin(@Param('login_id') login_id: string) {
    const id = parseInt(login_id, 10);
    if (isNaN(id)) {
      throw new Error('Invalid login_id');
    }
    return this.loginRepository.DeleteLogin(id);
  }

  // --- 🚀 NOUVELLES ROUTES COMPATIBLES GOOGLE ---

  // Route de déclenchement : http://localhost:3000/login/google
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // Passport gère automatiquement la redirection vers Google
  }

  // Route de retour (Callback) : http://localhost:3000/login/google/callback
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    try {
      // 1. Récupérer le profil renvoyé par Google
      const googleProfile = req.user;

      // 2. Chercher ou créer l'utilisateur dans la table `users`
      const userInDb = await this.usersRepository.findOrCreateGoogleUser(googleProfile);

      // 3. Ajouter une ligne dans la table `login` et générer le Token JWT de session
      const session = await this.loginRepository.validateAndGenerateToken(userInDb);

      // 4. Redirection vers le tableau de bord React avec le Token
      return res.redirect(`http://localhost:5173/dashboard?token=${session.access_token}`);
      
    } catch (error) {
      console.error("Erreur authentification Google :", error);
      return res.redirect('http://localhost:5173/?error=google_failed');
    }
  }
}