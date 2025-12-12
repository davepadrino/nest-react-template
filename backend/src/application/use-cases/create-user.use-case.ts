import { Injectable } from '@nestjs/common';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { User } from '@domain/entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserAlreadyExistsException } from '@domain/exceptions/domain.exception';

/**
 * From presentation (controller) to Domain (business logic)
 *
 * Application layer use case following CQRS principles.
 * Orchestrates the creation of a new user.
 */
@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new UserAlreadyExistsException(dto.email);
    }

    const user = User.create(
      dto.name,
      dto.email,
      dto.city,
      dto.birthDate ? new Date(dto.birthDate) : undefined,
    );

    return await this.userRepository.create(user);
  }
}
