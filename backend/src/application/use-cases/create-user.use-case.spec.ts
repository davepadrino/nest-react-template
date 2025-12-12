import { CreateUserUseCase } from './create-user.use-case';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { User } from '@domain/entities/user.entity';
import { UserAlreadyExistsException } from '@domain/exceptions/domain.exception';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let userRepository: jest.Mocked<IUserRepository>;

  beforeEach(async () => {
    userRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new CreateUserUseCase(userRepository);
  });

  it('should create a new user', async () => {
    const dto = {
      name: 'John Doe',
      email: 'john@example.com',
      city: 'New York',
    };

    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.create.mockImplementation(async (user) => user);

    const result = await useCase.execute(dto);

    expect(result).toBeInstanceOf(User);
    expect(result.name).toBe(dto.name);
    expect(result.email).toBe(dto.email);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(dto.email);
    expect(userRepository.create).toHaveBeenCalled();
  });

  it('should throw error if user already exists', async () => {
    const dto = {
      name: 'John Doe',
      email: 'john@example.com',
    };

    const existingUser = User.create('John Doe', 'john@example.com');
    userRepository.findByEmail.mockResolvedValue(existingUser);

    await expect(useCase.execute(dto)).rejects.toThrow(UserAlreadyExistsException);
    expect(userRepository.create).not.toHaveBeenCalled();
  });
});
