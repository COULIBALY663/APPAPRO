import { 
  Controller, Get, Post, Put, Delete, Body, Param, Req, UseGuards, Inject 
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { IUsersRepository } from '../repository/users.repository';
import { users } from '../models/users.models';
import { CreateUsersDto, UpdateUsersDto } from '../Dtos/users.dtos';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    @Inject(IUsersRepository)
    private readonly usersRepository: IUsersRepository,
  ) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Liste des utilisateurs', type: [users] })
  getAllUsers() {
    return this.usersRepository.getAllUsers();
  }

@UseGuards(JwtAuthGuard)
@Get('me')
@ApiResponse({ status: 200, description: 'Profil de l’utilisateur connecté', type: users })
async getMyProfile(@Req() req) {

  console.log('USER FROM TOKEN = ', req.user); // 🔥 DEBUG

  if (!req.user) {
    throw new Error('Utilisateur non authentifié');
  }

  const email = req.user.email;
  return this.usersRepository.findByEmail(email);
}


  @Get(':users_id')
  @ApiResponse({ status: 200, description: 'Utilisateur trouvé', type: users })
  findById(@Param('users_id') users_id: number) {
    return this.usersRepository.findByUsersId(Number(users_id));
  }

  @Get('email/:email')
  @ApiResponse({ status: 200, description: 'Utilisateur trouvé', type: users })
  findByEmail(@Param('email') email: string) {
    return this.usersRepository.findByEmail(email);
  }

  @Post()
  @ApiBody({ type: CreateUsersDto })
  @ApiResponse({ status: 201, description: 'Utilisateur créé', type: users })
  createUser(@Body() userDto: CreateUsersDto) {
    return this.usersRepository.createUsers(userDto);
  }

  @Put(':users_id')
  @ApiBody({ type: UpdateUsersDto })
  @ApiResponse({ status: 200, description: 'Utilisateur mis à jour', type: users })
  updateUser(@Param('users_id') users_id: number, @Body() updateDto: UpdateUsersDto) {
    return this.usersRepository.updateUsers(Number(users_id), updateDto);
  }

  @Delete(':users_id')
  @ApiResponse({ status: 200, description: 'Utilisateur supprimé' })
  deleteUser(@Param('users_id') users_id: number) {
    return this.usersRepository.deleteUsers(Number(users_id));
  }
}
