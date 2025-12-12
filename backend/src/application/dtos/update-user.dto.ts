import { IsString, IsEmail, IsOptional, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'John Doe', description: 'User full name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'john.doe@example.com', description: 'User email address' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'New York', description: 'User city' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ example: '1990-05-15', description: 'User birth date' })
  @IsDateString()
  @IsOptional()
  birthDate?: string;
}
