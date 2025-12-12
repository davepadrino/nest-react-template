import React, { createContext, useContext, ReactNode } from 'react';
import { HttpClient } from '@infrastructure/http/HttpClient';
import { UserRepository } from '@infrastructure/repositories/UserRepository';
import { GetAllUsersUseCase } from '@application/use-cases/GetAllUsersUseCase';
import { GetUserByIdUseCase } from '@application/use-cases/GetUserByIdUseCase';
import { CreateUserUseCase } from '@application/use-cases/CreateUserUseCase';
import { UpdateUserUseCase } from '@application/use-cases/UpdateUserUseCase';
import { DeleteUserUseCase } from '@application/use-cases/DeleteUserUseCase';

/**
 * Dependency Injection Context
 *
 * Provides dependencies throughout the application
 */
interface Dependencies {
  getAllUsersUseCase: GetAllUsersUseCase;
  getUserByIdUseCase: GetUserByIdUseCase;
  createUserUseCase: CreateUserUseCase;
  updateUserUseCase: UpdateUserUseCase;
  deleteUserUseCase: DeleteUserUseCase;
}

const DependencyContext = createContext<Dependencies | undefined>(undefined);

export const useDependencies = () => {
  const context = useContext(DependencyContext);
  if (!context) {
    throw new Error('useDependencies must be used within DependencyProvider');
  }
  return context;
};

interface Props {
  children: ReactNode;
}

export const DependencyProvider: React.FC<Props> = ({ children }) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  const httpClient = new HttpClient(apiUrl);
  const userRepository = new UserRepository(httpClient);

  const dependencies: Dependencies = {
    getAllUsersUseCase: new GetAllUsersUseCase(userRepository),
    getUserByIdUseCase: new GetUserByIdUseCase(userRepository),
    createUserUseCase: new CreateUserUseCase(userRepository),
    updateUserUseCase: new UpdateUserUseCase(userRepository),
    deleteUserUseCase: new DeleteUserUseCase(userRepository),
  };

  return <DependencyContext.Provider value={dependencies}>{children}</DependencyContext.Provider>;
};
