import { User } from '@domain/entities/User';
import { IUserRepository } from '@domain/repositories/IUserRepository';

/**
 * Use Case: Get All Users
 */
export class GetAllUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
}
