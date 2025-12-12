import { Injectable } from '@nestjs/common';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { UserNotFoundException } from '@domain/exceptions/domain.exception';

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundException(id);
    }

    await this.userRepository.delete(id);
  }
}
