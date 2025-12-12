import { User } from '@domain/entities/User';
import { IUserRepository, UpdateUserData } from '@domain/repositories/IUserRepository';

/**
 * Use Case: Update User
 */
export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string, data: UpdateUserData): Promise<User> {
    if (data.email && !this.isValidEmail(data.email)) {
      throw new Error('Valid email is required');
    }

    return await this.userRepository.update(id, data);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
