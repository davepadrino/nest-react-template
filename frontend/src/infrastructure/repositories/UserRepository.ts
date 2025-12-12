import { User } from '@domain/entities/User';
import {
  IUserRepository,
  CreateUserData,
  UpdateUserData,
} from '@domain/repositories/IUserRepository';
import { HttpClient } from '../http/HttpClient';
import { UserResponseDTO } from '@application/dtos/UserDTO';

/**
 *
 * Infrastructure layer - implements the repository using HTTP client
 */
export class UserRepository implements IUserRepository {
  private readonly basePath = '/users';

  constructor(private httpClient: HttpClient) {}

  async findAll(): Promise<User[]> {
    const users = await this.httpClient.get<UserResponseDTO[]>(this.basePath);
    return users.map((dto) => User.fromDTO(dto));
  }

  async findById(id: string): Promise<User> {
    const user = await this.httpClient.get<UserResponseDTO>(`${this.basePath}/${id}`);
    return User.fromDTO(user);
  }

  async create(data: CreateUserData): Promise<User> {
    const user = await this.httpClient.post<UserResponseDTO>(this.basePath, data);
    return User.fromDTO(user);
  }

  async update(id: string, data: UpdateUserData): Promise<User> {
    const user = await this.httpClient.put<UserResponseDTO>(`${this.basePath}/${id}`, data);
    return User.fromDTO(user);
  }

  async delete(id: string): Promise<void> {
    await this.httpClient.delete(`${this.basePath}/${id}`);
  }
}
