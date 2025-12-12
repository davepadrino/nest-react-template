import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { CreateUserUseCase } from '@application/use-cases/create-user.use-case';
import { GetAllUsersUseCase } from '@application/use-cases/get-all-users.use-case';
import { GetUserByIdUseCase } from '@application/use-cases/get-user-by-id.use-case';
import { UpdateUserUseCase } from '@application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '@application/use-cases/delete-user.use-case';
import { User } from '@domain/entities/user.entity';

describe('UserController', () => {
  let controller: UserController;
  let createUserUseCase: jest.Mocked<CreateUserUseCase>;
  let getAllUsersUseCase: jest.Mocked<GetAllUsersUseCase>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: CreateUserUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: GetAllUsersUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: GetUserByIdUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: UpdateUserUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: DeleteUserUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    createUserUseCase = module.get(CreateUserUseCase);
    getAllUsersUseCase = module.get(GetAllUsersUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const dto = { name: 'John Doe', email: 'john@example.com' };
      const user = User.create(dto.name, dto.email);

      createUserUseCase.execute.mockResolvedValue(user);

      const result = await controller.create(dto);

      expect(result).toEqual(user.toObject());
      expect(createUserUseCase.execute).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [
        User.create('John Doe', 'john@example.com'),
        User.create('Jane Doe', 'jane@example.com'),
      ];

      getAllUsersUseCase.execute.mockResolvedValue(users);

      const result = await controller.findAll();

      expect(result).toHaveLength(2);
      expect(getAllUsersUseCase.execute).toHaveBeenCalled();
    });
  });
});
