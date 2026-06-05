import { CreateUsersDto, UpdateUsersDto } from "../Dtos/users.dtos";
import { users } from "../models/users.models";

export const IUsersRepository = Symbol('IUsersRepository');

export interface IUsersRepository {

  findByEmail(email: string): Promise<users | null>;

  createUsers(data: CreateUsersDto): Promise<users>;

  findByUsersId(users_id: number): Promise<users | null>;

  getAllUsers(): Promise<users[]>;

  updateUsers(
    users_id: number,
    data: UpdateUsersDto
  ): Promise<users | null>;

  deleteUsers(users_id: number): Promise<boolean>;
}
