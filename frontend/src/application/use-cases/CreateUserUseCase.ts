import { User } from '@domain/entities/User';
import { IUserRepository, CreateUserData } from '@domain/repositories/IUserRepository';

/**
 * Use Case: Create User
 */
export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: CreateUserData): Promise<User> {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Name is required');
    }
    if (!data.email || !this.isValidEmail(data.email)) {
      throw new Error('Valid email is required');
    }

    return await this.userRepository.create(data);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
