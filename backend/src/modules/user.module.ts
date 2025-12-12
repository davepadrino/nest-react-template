import { Module } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { UserRepository } from '@infrastructure/repositories/user.repository';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { CreateUserUseCase } from '@application/use-cases/create-user.use-case';
import { GetAllUsersUseCase } from '@application/use-cases/get-all-users.use-case';
import { GetUserByIdUseCase } from '@application/use-cases/get-user-by-id.use-case';
import { UpdateUserUseCase } from '@application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '@application/use-cases/delete-user.use-case';
import { UserController } from '@presentation/controllers/user.controller';

/**
 * User Module
 * 
 * Aggregates all user-related components following DDD structure
 */
@Module({
  controllers: [UserController],
  providers: [
    PrismaService,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: CreateUserUseCase,
      useFactory: (userRepository: IUserRepository) => {
        return new CreateUserUseCase(userRepository);
      },
      inject: ['IUserRepository'],
    },
    {
      provide: GetAllUsersUseCase,
      useFactory: (userRepository: IUserRepository) => {
        return new GetAllUsersUseCase(userRepository);
      },
      inject: ['IUserRepository'],
    },
    {
      provide: GetUserByIdUseCase,
      useFactory: (userRepository: IUserRepository) => {
        return new GetUserByIdUseCase(userRepository);
      },
      inject: ['IUserRepository'],
    },
    {
      provide: UpdateUserUseCase,
      useFactory: (userRepository: IUserRepository) => {
        return new UpdateUserUseCase(userRepository);
      },
      inject: ['IUserRepository'],
    },
    {
      provide: DeleteUserUseCase,
      useFactory: (userRepository: IUserRepository) => {
        return new DeleteUserUseCase(userRepository);
      },
      inject: ['IUserRepository'],
    },
  ],
  exports: ['IUserRepository'],
})
export class UserModule {}
