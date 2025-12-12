import { IsString, IsEmail, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: 'New York', description: 'User city' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ example: '1990-05-15', description: 'User birth date' })
  @IsDateString()
  @IsOptional()
  birthDate?: string;
}
