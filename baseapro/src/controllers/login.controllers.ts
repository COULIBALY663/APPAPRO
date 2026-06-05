import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Controller, Post, Body, Param, Inject, Delete } from '@nestjs/common';
import { ILoginRepository } from '../repository/login.repository';
import { Login } from '../models/login.model';
import { CreateLoginDto } from '../Dtos/login.dtos';

@ApiTags('Login')
@Controller('login')
export class LoginController {

  constructor(
    @Inject(ILoginRepository)
    private readonly loginRepository: ILoginRepository,
  ) {}

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
}
