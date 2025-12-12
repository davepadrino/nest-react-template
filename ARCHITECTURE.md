# Architecture Documentation

## Domain-Driven Design (DDD) Overview

This project implements Domain-Driven Design across both backend and frontend applications. DDD is a software development approach that focuses on modeling software to match the business domain.

## Layer Architecture

### 1. Domain Layer (Core Business Logic)

**Purpose**: Contains the core business logic and rules, independent of any framework or external concerns.

**Components**:
- **Entities**: Business objects with identity and lifecycle (e.g., User)
- **Value Objects**: Immutable objects defined by their attributes
- **Domain Events**: Represent something that happened in the domain
- **Repository Interfaces**: Contracts for data access (dependency inversion)
- **Domain Exceptions**: Business rule violations

**Key Principles**:
- Framework-independent
- Contains business invariants and validation
- No dependencies on infrastructure
- Pure TypeScript/JavaScript

**Example (Backend)**:
```typescript
// backend/src/domain/entities/user.entity.ts
export class User {
  private _name: string;
  
  constructor(name: string) {
    this._name = name;
    this.validate(); // Business rule enforcement
  }
  
  private validate(): void {
    if (!this._name || this._name.trim().length === 0) {
      throw new Error('User name cannot be empty'); // Domain exception
    }
  }
}
```

### 2. Application Layer (Use Cases)

**Purpose**: Orchestrates the flow of data and coordinates domain objects to perform business operations.

**Components**:
- **Use Cases**: Single business operations (e.g., CreateUser, GetUserById)
- **DTOs**: Data Transfer Objects for input/output
- **Application Services**: Coordinate use cases

**Key Principles**:
- Thin layer - no business logic
- Delegates to domain layer
- Transaction management
- Input validation

**Example (Backend)**:
```typescript
// backend/src/application/use-cases/create-user.use-case.ts
export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}
  
  async execute(dto: CreateUserDto): Promise<User> {
    // Check business rules
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new UserAlreadyExistsException(dto.email);
    }
    
    // Create domain entity (business logic happens here)
    const user = User.create(dto.name, dto.email);
    
    // Persist
    return await this.userRepository.create(user);
  }
}
```

### 3. Infrastructure Layer (Technical Details)

**Purpose**: Implements technical capabilities needed by the application (databases, HTTP clients, logging, etc.).

**Components**:
- **Repository Implementations**: Concrete implementations using Prisma, Axios, etc.
- **Database Services**: Prisma client, connection management
- **HTTP Clients**: Axios configuration
- **Logging**: Winston logger implementation
- **External Services**: Third-party integrations

**Key Principles**:
- Implements interfaces from domain layer
- Contains all technical details
- Can be swapped without affecting business logic
- Framework-specific code lives here

**Example (Backend)**:
```typescript
// backend/src/infrastructure/repositories/user.repository.ts
export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}
  
  async create(user: User): Promise<User> {
    const data = user.toObject();
    const created = await this.prisma.user.create({ data });
    return this.toDomain(created); // Map Prisma model to Domain entity
  }
}
```

### 4. Presentation Layer (UI/API)

**Purpose**: Handles user interaction and external communication.

**Backend Components**:
- **Controllers**: REST API endpoints
- **Filters**: Exception handling
- **Middleware**: Request/response processing
- **Swagger Documentation**: API specs

**Frontend Components**:
- **Components**: React components
- **Pages**: Page-level components
- **Context**: React Context for DI
- **Styles**: Styled components

**Key Principles**:
- Thin layer - delegates to use cases
- Input validation (additional layer)
- HTTP status code mapping
- UI rendering logic only

**Example (Backend)**:
```typescript
// backend/src/presentation/controllers/user.controller.ts
@Controller('users')
export class UserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}
  
  @Post()
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.createUserUseCase.execute(dto);
    return user.toObject(); // Convert to DTO for API response
  }
}
```

## Design Patterns Used

### 1. Repository Pattern

**Why**: Abstracts data access logic, making it easy to:
- Swap databases without changing business logic
- Mock repositories in tests
- Centralize data access logic

**Implementation**:
```typescript
// Interface in Domain Layer
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  create(user: User): Promise<User>;
}

// Implementation in Infrastructure Layer
export class UserRepository implements IUserRepository {
  // Prisma-specific implementation
}
```

### 2. Dependency Injection

**Why**: Loosely couples components, enabling:
- Easy testing with mocks
- Flexible configuration
- Better modularity

**Backend (NestJS)**:
```typescript
@Module({
  providers: [
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
})
export class UserModule {}
```

**Frontend (React Context)**:
```typescript
export const DependencyProvider: React.FC = ({ children }) => {
  const httpClient = new HttpClient(apiUrl);
  const userRepository = new UserRepository(httpClient);
  const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
  
  return (
    <DependencyContext.Provider value={{ getAllUsersUseCase }}>
      {children}
    </DependencyContext.Provider>
  );
};
```

### 3. Use Case Pattern (CQRS-inspired)

**Why**: Each use case represents a single business operation:
- Easy to understand
- Easy to test
- Follows Single Responsibility Principle
- Aligns with user stories

**Example**:
- CreateUserUseCase
- GetUserByIdUseCase
- UpdateUserUseCase
- DeleteUserUseCase

### 4. Factory Pattern

**Why**: Centralizes object creation logic.

**Example**:
```typescript
export class User {
  static create(name: string, email: string): User {
    const id = crypto.randomUUID();
    const now = new Date();
    return new User(id, name, email, now, now);
  }
}
```

## Data Flow

### Backend Request Flow

```
HTTP Request
    ↓
Controller (Presentation Layer)
    ↓
Use Case (Application Layer)
    ↓
Domain Entity (Domain Layer)
    ↓
Repository Implementation (Infrastructure Layer)
    ↓
Database (Prisma)
    ↓
Repository Implementation
    ↓
Domain Entity
    ↓
Use Case
    ↓
Controller
    ↓
HTTP Response
```

### Frontend Data Flow

```
User Action (Component)
    ↓
Use Case (Application Layer)
    ↓
Repository (Infrastructure Layer)
    ↓
HTTP Client (Axios)
    ↓
Backend API
    ↓
HTTP Client
    ↓
Repository (maps to Domain Entity)
    ↓
Use Case
    ↓
Component (updates state)
    ↓
UI Update
```

## Key Architectural Benefits

### 1. Testability
Each layer can be tested independently:
- **Domain**: Pure business logic tests
- **Application**: Use case tests with mocked repositories
- **Infrastructure**: Integration tests
- **Presentation**: UI/Controller tests

### 2. Maintainability
Clear separation of concerns:
- Business logic in domain layer
- Technical details in infrastructure
- Easy to locate and modify code

### 3. Scalability
Easy to extend:
- Add new entities following the same pattern
- Add new use cases without affecting existing ones
- Swap implementations without changing interfaces

### 4. Framework Independence
Core business logic doesn't depend on:
- NestJS
- Prisma
- React
- Any specific framework

### 5. Interview-Friendly
Demonstrates understanding of:
- Software architecture principles
- Design patterns
- Separation of concerns
- SOLID principles
- Clean code

## Trade-offs

### Pros
✅ Highly maintainable and scalable
✅ Easy to test
✅ Clear structure
✅ Framework independence
✅ Team-friendly (clear responsibilities)

### Cons
❌ More files and boilerplate
❌ Steeper learning curve
❌ Overkill for very simple applications
❌ More initial setup time

## When to Use This Architecture

**Good for**:
- Complex business logic
- Long-term projects
- Team collaboration
- Applications expected to grow
- Interview/portfolio projects

**Overkill for**:
- Simple CRUD apps with no business logic
- Prototypes/MVPs
- Projects with extremely tight deadlines
- Single-developer hobby projects

## Adapting for Different Databases

To switch from SQLite to PostgreSQL:

1. Update `backend/prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // Changed from sqlite
  url      = env("DATABASE_URL")
}
```

2. Update environment variable:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
```

3. Run migration:
```bash
make migrate-dev
```

**No business logic changes required!** This is the power of the repository pattern.

## Adding Authentication

To add JWT authentication while maintaining the architecture:

1. **Domain Layer**: Add User authentication methods
```typescript
export class User {
  validatePassword(password: string): boolean {
    // Business logic for password validation
  }
}
```

2. **Application Layer**: Add authentication use cases
```typescript
export class LoginUseCase {
  async execute(email: string, password: string): Promise<AuthToken> {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !user.validatePassword(password)) {
      throw new InvalidCredentialsException();
    }
    return this.tokenService.generateToken(user);
  }
}
```

3. **Infrastructure Layer**: Implement JWT service
```typescript
export class JwtTokenService implements ITokenService {
  generateToken(user: User): AuthToken {
    // JWT implementation
  }
}
```

4. **Presentation Layer**: Add auth guards/middleware
```typescript
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController { }
```

## Further Reading

- [Domain-Driven Design by Eric Evans](https://www.domainlanguage.com/ddd/)
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)

---

This architecture provides a solid foundation for building scalable, maintainable applications while demonstrating professional software engineering practices.
