export interface CreateUserDTO {
  name: string;
  email: string;
  city?: string;
  birthDate?: string;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  city?: string;
  birthDate?: string;
}

export interface UserResponseDTO {
  id: string;
  name: string;
  email: string;
  city?: string;
  birthDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
