import { Injectable } from '@nestjs/common';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { User } from '@domain/entities/user.entity';
import { PrismaService } from '../database/prisma.service';
import { User as PrismaUser } from '@prisma/client';

/**
 * User Repository Implementation
 * 
 * Infrastructure layer - implements the repository interface using Prisma
 * Maps between Prisma models and Domain entities
 */
@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map(this.toDomain);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? this.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? this.toDomain(user) : null;
  }

  async create(user: User): Promise<User> {
    const userData = user.toObject();
    const created = await this.prisma.user.create({
      data: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        city: userData.city,
        birthDate: userData.birthDate,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      },
    });
    return this.toDomain(created);
  }

  async update(user: User): Promise<User> {
    const userData = user.toObject();
    const updated = await this.prisma.user.update({
      where: { id: userData.id },
      data: {
        name: userData.name,
        email: userData.email,
        city: userData.city,
        birthDate: userData.birthDate,
        updatedAt: userData.updatedAt,
      },
    });
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  // Mapper: Prisma Model -> Domain Entity
  private toDomain(prismaUser: PrismaUser): User {
    return new User(
      prismaUser.id,
      prismaUser.name,
      prismaUser.email,
      prismaUser.createdAt,
      prismaUser.updatedAt,
      prismaUser.city || undefined,
      prismaUser.birthDate || undefined,
    );
  }
}
