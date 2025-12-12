import { User } from '@domain/entities/User';
import { IUserRepository } from '@domain/repositories/IUserRepository';

/**
 * Use Case: Get User By ID
 */
export class GetUserByIdUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string): Promise<User> {
    return await this.userRepository.findById(id);
  }
}
