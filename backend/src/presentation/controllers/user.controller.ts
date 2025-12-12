import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateUserDto } from '@application/dtos/create-user.dto';
import { UpdateUserDto } from '@application/dtos/update-user.dto';
import { UserResponseDto } from '@application/dtos/user-response.dto';
import { CreateUserUseCase } from '@application/use-cases/create-user.use-case';
import { GetAllUsersUseCase } from '@application/use-cases/get-all-users.use-case';
import { GetUserByIdUseCase } from '@application/use-cases/get-user-by-id.use-case';
import { UpdateUserUseCase } from '@application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '@application/use-cases/delete-user.use-case';
import { LoggerService } from '@infrastructure/logging/logger.service';

/**
 *
 * Presentation layer - handles HTTP requests and delegates to use cases
 */
@ApiTags('users')
@Controller('users')
export class UserController {
  private readonly logger = new LoggerService(UserController.name);

  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    this.logger.log('Creating new user', { email: createUserDto.email });
    const user = await this.createUserUseCase.execute(createUserDto);
    return user.toObject();
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    type: [UserResponseDto],
  })
  async findAll(): Promise<UserResponseDto[]> {
    this.logger.log('Fetching all users');
    const users = await this.getAllUsersUseCase.execute();
    return users.map((user) => user.toObject());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    this.logger.log('Fetching user by ID', { id });
    const user = await this.getUserByIdUseCase.execute(id);
    return user.toObject();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    this.logger.log('Updating user', { id });
    const user = await this.updateUserUseCase.execute(id, updateUserDto);
    return user.toObject();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id') id: string): Promise<void> {
    this.logger.log('Deleting user', { id });
    await this.deleteUserUseCase.execute(id);
  }
}
