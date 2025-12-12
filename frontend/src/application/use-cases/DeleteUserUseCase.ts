import { IUserRepository } from '@domain/repositories/IUserRepository';

/**
 * Use Case: Delete User
 */
export class DeleteUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
