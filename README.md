# NestJS + React Full-Stack Template

A production-ready full-stack template for coding interviews and rapid prototyping, featuring **NestJS** backend and **React** frontend, both following **Domain-Driven Design (DDD)** architecture.

## 🎯 Overview

This template provides a robust foundation for building scalable web applications with:

- **Backend**: NestJS with DDD architecture (Domain, Application, Infrastructure, Presentation layers)
- **Frontend**: React with Vite, following DDD principles
- **Database**: Prisma ORM with SQLite (easily adaptable to PostgreSQL/MySQL)
- **Styling**: Styled Components
- **Testing**: Jest with comprehensive test examples
- **Docker**: Backend containerization
- **CI/CD**: GitHub Actions for automated testing
- **API Documentation**: Swagger/OpenAPI

## 📁 Project Structure

```
nest-react-template/
├── backend/                    # NestJS Backend
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.ts            # Database seeding
│   ├── src/
│   │   ├── domain/            # Domain Layer (Entities, Repositories Interfaces)
│   │   │   ├── entities/      # Business entities with logic
│   │   │   ├── repositories/  # Repository interfaces
│   │   │   └── exceptions/    # Domain exceptions
│   │   ├── application/       # Application Layer (Use Cases, DTOs)
│   │   │   ├── use-cases/     # Business use cases (CQRS style)
│   │   │   └── dtos/          # Data Transfer Objects
│   │   ├── infrastructure/    # Infrastructure Layer (DB, Logging)
│   │   │   ├── database/      # Prisma service
│   │   │   ├── repositories/  # Repository implementations
│   │   │   └── logging/       # Winston logger
│   │   ├── presentation/      # Presentation Layer (Controllers, Filters)
│   │   │   ├── controllers/   # REST controllers
│   │   │   └── filters/       # Exception filters
│   │   ├── modules/           # NestJS modules
│   │   ├── app.module.ts      # Root module
│   │   └── main.ts            # Application entry point
│   ├── Dockerfile             # Docker configuration
│   └── package.json
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── domain/            # Domain Layer
│   │   │   ├── entities/      # Business entities
│   │   │   ├── repositories/  # Repository interfaces
│   │   │   └── exceptions/    # Domain exceptions
│   │   ├── application/       # Application Layer
│   │   │   ├── use-cases/     # Business use cases
│   │   │   └── dtos/          # Data Transfer Objects
│   │   ├── infrastructure/    # Infrastructure Layer
│   │   │   ├── http/          # HTTP client (Axios)
│   │   │   ├── repositories/  # Repository implementations
│   │   │   ├── logging/       # Logger service
│   │   │   └── error/         # Error handling
│   │   └── presentation/      # Presentation Layer
│   │       ├── components/    # React components
│   │       ├── pages/         # Page components
│   │       ├── context/       # React Context (DI)
│   │       └── styles/        # Styled components
│   ├── vite.config.ts         # Vite configuration
│   └── package.json
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions CI/CD
├── docker-compose.yml          # Docker Compose configuration
├── Makefile                    # Development commands
├── tsconfig.base.json          # Shared TypeScript config
└── README.md
```

## 🏗️ Architecture Decisions

### Domain-Driven Design (DDD)

Both backend and frontend follow DDD principles with clear separation of concerns:

1. **Domain Layer**: Core business logic, entities, and rules (framework-independent)
2. **Application Layer**: Use cases and application-specific business rules
3. **Infrastructure Layer**: External concerns (database, HTTP, logging)
4. **Presentation Layer**: User interface and API controllers

### Why This Architecture?

- **Scalability**: Easy to add new features and entities
- **Testability**: Each layer can be tested independently
- **Maintainability**: Clear boundaries and responsibilities
- **Interview-Ready**: Demonstrates understanding of software architecture principles
- **Flexibility**: Easy to swap implementations (e.g., change database or HTTP client)

### Repository Pattern

- Abstracts data access logic
- Allows easy mocking in tests
- Decouples business logic from data storage

### Use Cases (CQRS-style)

- Each use case represents a single business operation
- Easy to understand and test
- Follows Single Responsibility Principle

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- Yarn >= 1.22.0
- Docker (optional, for containerized backend)

### Quick Setup

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd nest-react-template

# 2. Install all dependencies + setup database and seed data (also starts the backend)
make setup

# 3. Start development servers (both backend and frontend)
make start
```

The application will be available at:

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api/docs

### Alternative: Manual Setup

```bash
# Install dependencies
yarn install
cd backend && yarn install
cd ../frontend && yarn install

# Setup backend
cd backend
cp .env.example .env
npx prisma generate
npx prisma migrate dev
yarn prisma:seed

# Start backend
yarn start:dev

# In another terminal, start frontend
cd frontend
cp .env.example .env
yarn dev
```

## 🛠️ Available Commands

The project includes a comprehensive Makefile for common tasks:

### Development

```bash
make start              # Start both backend and frontend
make start-backend      # Start only backend
make start-frontend     # Start only frontend
```

### Building

```bash
make build              # Build both projects
```

### Testing

```bash
make test               # Run all tests
make test-backend       # Run backend tests only
make test-frontend      # Run frontend tests only
make test-watch         # Run tests in watch mode
```

### Code Quality

```bash
make lint               # Run linters
make format             # Format code with Prettier
```

### Database

```bash
make migrate-dev        # Run database migrations
make migrate-reset      # Reset database
make db-studio          # Open Prisma Studio
make db-seed            # Seed database with sample data
```

### Docker

```bash
make docker-up          # Start backend in Docker
make docker-down        # Stop Docker containers
make docker-build       # Build Docker images
make docker-logs        # View Docker logs
```

### Utilities

```bash
make clean              # Clean all dependencies and builds
make help               # Show all available commands
```

### TODO

Setup localstack (for example) to develop and test locally with cloud based environments (e.g: AWS, etc)

## 🧪 Testing

### Backend Tests

```bash
cd backend
yarn test                # Run tests
yarn test:watch      # Watch mode
yarn test:cov        # Coverage report
```

Test files are located next to the source files:

- `*.spec.ts` for unit tests
- Tests cover entities, use cases, and controllers

### Frontend Tests

```bash
cd frontend
yarn test                # Run tests
yarn test:watch      # Watch mode
yarn test:coverage   # Coverage report
```

Test files:

- `*.test.ts` for logic tests
- `*.test.tsx` for component tests

## 🐳 Docker

### Running Backend in Docker

```bash
# Build and start
make docker-up

# Or using docker-compose directly
docker-compose up -d

# View logs
make docker-logs

# Stop containers
make docker-down
```

The Dockerfile uses multi-stage builds for optimization:

1. **Builder stage**: Compiles TypeScript and generates Prisma client
2. **Production stage**: Runs the application with minimal dependencies

## 📚 API Documentation

Swagger documentation is automatically generated and available at:

- http://localhost:3000/api/docs

Features:

- Interactive API testing
- Request/response schemas
- Authentication (when implemented)

## 🔧 Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
DATABASE_URL="file:./dev.db"
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001
```

### Frontend Environment Variables

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

## 📦 Adding New Features

### Quick Entity Generation

Use the provided script to scaffold a new entity with all layers:

```bash
# Generate entity structure (backend + frontend)
./scripts/generate-entity.sh Product

# Follow the manual steps printed:
# 1. Add Prisma model to schema.prisma
# 2. Run: make migrate-dev
# 3. Implement the generated file stubs
# 4. Import module in app.module.ts
```

This creates all necessary files following the DDD structure.

### Adding a New Entity (Manual)

1. **Define the entity** in `backend/src/domain/entities/`
2. **Create repository interface** in `backend/src/domain/repositories/`
3. **Define DTOs** in `backend/src/application/dtos/`
4. **Create use cases** in `backend/src/application/use-cases/`
5. **Implement repository** in `backend/src/infrastructure/repositories/`
6. **Create controller** in `backend/src/presentation/controllers/`
7. **Create module** in `backend/src/modules/`
8. **Update Prisma schema** in `backend/prisma/schema.prisma`
9. **Run migration**: `make migrate-dev`

### Adding a New Entity (Frontend)

1. **Define entity** in `frontend/src/domain/entities/`
2. **Create repository interface** in `frontend/src/domain/repositories/`
3. **Define DTOs** in `frontend/src/application/dtos/`
4. **Create use cases** in `frontend/src/application/use-cases/`
5. **Implement repository** in `frontend/src/infrastructure/repositories/`
6. **Create components** in `frontend/src/presentation/components/`
7. **Create pages** in `frontend/src/presentation/pages/`

## Backend migration to microservices

This template is prepared to handle a future migration to microservices. I'll present next a list of what we can use already and what we need to adapt

✅ What's microservices-Ready:

1. **Bounded Contexts:** User module can easily become a service
2. **Repository Pattern:** Can swap HTTP calls for database calls
3. **Use Cases:** Already encapsulated business logic
4. **DTOs:** Ready for API contracts between services
5. **Dependency Injection:**: Loose coupling makes it easy to swap implementations
6. **Clear boundaries**: Each layer is independent

❌ What would need to Change:

1. **Add API Gateway\*\***: Single entry point for all services
2. **Inter-service communication**: HTTP client or message broker
3. **Service discovery**: Consul, Eureka, or Kubernetes DNS
4. **Distributed tracing**: Jaeger, Zipkin
5. **Multiple databases**: One per service
6. **Event-driven architecture**: For async communication
7. **API versioning**: For backward compatibility

## 🎨 Styling

The frontend uses **Styled Components** for styling:

```typescript
import styled from 'styled-components';

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
`;
```

Common styles are available in `frontend/src/presentation/styles/common.ts`.

## 🔐 Adding Authentication (Future Enhancement)

To add JWT authentication:

1. Install dependencies: `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`
2. Create Auth module with login/register use cases
3. Add JWT strategy and guards
4. Protect routes with guards
5. Add authentication context in frontend
6. Store JWT in localStorage/cookies

## 📝 Logging

### Backend

Uses Winston for structured logging:

```typescript
import { LoggerService } from '@infrastructure/logging/logger.service';

const logger = new LoggerService('MyContext');
logger.log('Info message');
logger.error('Error message', error);
```

### Frontend

Custom logger with environment-aware debug logging:

```typescript
import { Logger } from '@infrastructure/logging/Logger';

const logger = new Logger('MyComponent');
logger.log('Info message');
logger.error('Error occurred', error);
```

## 🚨 Error Handling

### Backend

- Global exception filter catches all errors
- Domain exceptions are mapped to appropriate HTTP status codes
- Structured error responses

### Frontend

- ErrorHandler class provides user-friendly messages
- HTTP errors are properly handled and displayed
- Network errors are caught and reported

## 🤝 Contributing

When contributing, please:

1. Follow the established DDD architecture
2. Write tests for new features
3. Update documentation
4. Follow the existing code style (enforced by ESLint/Prettier)

## 📄 License

This project is licensed under the MIT License.

## 💡 Tips

- **Demonstrate scalability**: Show how easy it is to add new features
- **Discuss testing**: Highlight the comprehensive test coverage
- **Talk about trade-offs**: DDD adds complexity but improves maintainability
- **Show best practices**: Dependency injection, separation of concerns, clean code

## 🐛 Troubleshooting

### Port already in use

```bash
# Kill process on port 3000 (backend)
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001 (frontend)
lsof -ti:3001 | xargs kill -9
```

### Prisma issues

```bash
# Reset everything
make migrate-reset

# Regenerate client
make db-generate
```

### Docker issues

```bash
# Clean up
docker-compose down -v
docker system prune -a
```

Dave 2025
