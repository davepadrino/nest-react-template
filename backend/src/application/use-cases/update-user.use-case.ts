import { Injectable } from '@nestjs/common';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { User } from '@domain/entities/user.entity';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserNotFoundException } from '@domain/exceptions/domain.exception';

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundException(id);
    }

    if (dto.name) {
      user.updateName(dto.name);
    }
    if (dto.email) {
      user.updateEmail(dto.email);
    }
    if (dto.city) {
      user.updateCity(dto.city);
    }
    if (dto.birthDate) {
      user.updateBirthDate(new Date(dto.birthDate));
    }

    return await this.userRepository.update(user);
  }
}
