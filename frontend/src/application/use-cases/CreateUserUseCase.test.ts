import { CreateUserUseCase } from './CreateUserUseCase';
import { IUserRepository, CreateUserData } from '@domain/repositories/IUserRepository';
import { User } from '@domain/entities/User';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new CreateUserUseCase(mockRepository);
  });

  it('should create a user successfully', async () => {
    const userData: CreateUserData = {
      name: 'John Doe',
      email: 'john@example.com',
      city: 'New York',
    };

    const mockUser = new User(
      '123',
      'John Doe',
      'john@example.com',
      new Date(),
      new Date(),
      'New York',
    );

    mockRepository.create.mockResolvedValue(mockUser);

    const result = await useCase.execute(userData);

    expect(result).toBe(mockUser);
    expect(mockRepository.create).toHaveBeenCalledWith(userData);
  });

  it('should throw error for empty name', async () => {
    const userData: CreateUserData = {
      name: '',
      email: 'john@example.com',
    };

    await expect(useCase.execute(userData)).rejects.toThrow('Name is required');
    expect(mockRepository.create).not.toHaveBeenCalled();
  });

  it('should throw error for invalid email', async () => {
    const userData: CreateUserData = {
      name: 'John Doe',
      email: 'invalid-email',
    };

    await expect(useCase.execute(userData)).rejects.toThrow('Valid email is required');
    expect(mockRepository.create).not.toHaveBeenCalled();
  });
});
