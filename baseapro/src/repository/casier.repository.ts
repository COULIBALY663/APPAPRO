import { casier } from '../models/casier.models';

export const CASIER_REPOSITORY = Symbol('CASIER_REPOSITORY');

export interface ICasierRepository {
  createCasier(body: any, files: any[]): Promise<casier>;

  findByCasierId(casier_id: number): Promise<casier | null>;

  getAllCasiers(): Promise<casier[]>;

  updateCasier(
    casier_id: number,
    body: any,
    files: any[],
  ): Promise<casier | null>;

  deleteCasier(casier_id: number): Promise<boolean>;
}