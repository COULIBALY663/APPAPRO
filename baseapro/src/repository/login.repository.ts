import{Login} from '../models/login.model';
import { CreateLoginDto } from '../Dtos/login.dtos';
export const ILoginRepository = Symbol('ILoginRepository');
export interface ILoginRepository {
    CreateLogin(login: CreateLoginDto): Promise<Login>;
    DeleteLogin(id_login: number): Promise<void>;
}