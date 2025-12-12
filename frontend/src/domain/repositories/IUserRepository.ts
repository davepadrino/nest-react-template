import { User } from '../entities/User';

/**
 *
 * Defines the contract for user data access
 */
export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User>;
  create(data: CreateUserData): Promise<User>;
  update(id: string, data: UpdateUserData): Promise<User>;
  delete(id: string): Promise<void>;
}

export interface CreateUserData {
  name: string;
  email: string;
  city?: string;
  birthDate?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  city?: string;
  birthDate?: string;
}
