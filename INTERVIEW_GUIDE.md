# Interview Quick Start Guide

This guide helps you quickly set up and use this template during coding interviews.

## ⚡ 5-Minute Setup

```bash
# 1. Clone and navigate
git clone <repo-url>
cd nest-react-template

# 2. One-command setup (installs dependencies, sets up DB, seeds data)
make setup

# 3. Start both servers
make start
```

**URLs**:
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000
- API Docs: http://localhost:3000/api/docs

## 🎯 Common Interview Scenarios

### Scenario 1: "Create a REST API for managing products"

1. **Create Prisma schema** (`backend/prisma/schema.prisma`):
```prisma
model Product {
  id          String   @id @default(uuid())
  name        String
  description String?
  price       Float
  stock       Int
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("products")
}
```

2. **Run migration**:
```bash
make migrate-dev
# Name it: "add_product_model"
```

3. **Copy User structure and rename**:
   - Copy `domain/entities/user.entity.ts` → `product.entity.ts`
   - Copy `domain/repositories/user.repository.interface.ts` → `product.repository.interface.ts`
   - Copy `application/use-cases/create-user.use-case.ts` → `create-product.use-case.ts`
   - Update field names and business logic

4. **Implement infrastructure**:
   - Copy `infrastructure/repositories/user.repository.ts` → `product.repository.ts`
   - Update Prisma queries

5. **Create controller**:
   - Copy `presentation/controllers/user.controller.ts` → `product.controller.ts`
   - Update endpoints

6. **Create module**:
   - Copy `modules/user.module.ts` → `product.module.ts`
   - Import in `app.module.ts`

**Estimated time**: 15-20 minutes

### Scenario 2: "Add validation for email uniqueness"

Already implemented! Check `CreateUserUseCase`:
```typescript
const existingUser = await this.userRepository.findByEmail(dto.email);
if (existingUser) {
  throw new UserAlreadyExistsException(dto.email);
}
```

### Scenario 3: "Add filtering and pagination"

1. **Update repository interface**:
```typescript
export interface IUserRepository {
  findAll(filters?: UserFilters, pagination?: Pagination): Promise<User[]>;
}
```

2. **Implement in repository**:
```typescript
async findAll(filters?: UserFilters, pagination?: Pagination): Promise<User[]> {
  const users = await this.prisma.user.findMany({
    where: {
      city: filters?.city,
      // Add more filters
    },
    skip: pagination?.offset,
    take: pagination?.limit,
  });
  return users.map(this.toDomain);
}
```

3. **Update use case and controller** accordingly.

### Scenario 4: "Add unit tests for a new feature"

Example for testing a use case:
```typescript
describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase;
  let mockRepository: jest.Mocked<IProductRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      // ... mock all methods
    };
    useCase = new CreateProductUseCase(mockRepository);
  });

  it('should create a product', async () => {
    const dto = { name: 'Product', price: 100, stock: 10 };
    mockRepository.create.mockResolvedValue(mockProduct);

    const result = await useCase.execute(dto);

    expect(result).toBe(mockProduct);
    expect(mockRepository.create).toHaveBeenCalled();
  });
});
```

### Scenario 5: "Add a new frontend feature"

1. **Create a new component** (`frontend/src/presentation/components/ProductCard.tsx`):
```typescript
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <Card>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
    </Card>
  );
};
```

2. **Add to page** (`frontend/src/presentation/pages/ProductListPage.tsx`):
```typescript
const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { getAllProductsUseCase } = useDependencies();

  useEffect(() => {
    getAllProductsUseCase.execute().then(setProducts);
  }, []);

  return (
    <Grid>
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </Grid>
  );
};
```

## 🗣️ Explaining Architecture in Interviews

### When asked "Why DDD?"

> "I chose Domain-Driven Design because it provides clear separation of concerns and makes the codebase highly maintainable and testable. The domain layer contains pure business logic, independent of frameworks. This means if we need to change databases or frameworks, we only modify the infrastructure layer. Each layer has a specific responsibility, making it easier to reason about the code and add new features."

### When asked "Why separate use cases?"

> "Each use case represents a single business operation, following the Single Responsibility Principle. This makes the code easier to test, understand, and maintain. For example, CreateUserUseCase handles only user creation, with its own validation and business rules. If requirements change, I know exactly where to look."

### When asked about testing

> "The architecture makes testing straightforward. Domain entities are tested in isolation with unit tests. Use cases are tested by mocking the repository. Controllers are tested with integration tests. The repository pattern allows us to easily mock data access in tests."

### When asked about scalability

> "The architecture scales well because:
1. **New features follow the same pattern** - just copy the structure
2. **Dependencies are inverted** - we depend on interfaces, not implementations
3. **Each layer can scale independently** - can optimize DB queries without touching business logic
4. **Easy to add new entities** - just follow the existing structure"

## 🔍 Code Review Points to Highlight

1. **Dependency Inversion**: Repository interfaces in domain, implementations in infrastructure
2. **Single Responsibility**: Each use case does one thing
3. **Error Handling**: Custom exceptions, global exception filter
4. **Validation**: Both at domain level (business rules) and presentation level (input validation)
5. **Logging**: Structured logging with Winston
6. **Type Safety**: Strong typing throughout with TypeScript
7. **Testing**: Comprehensive test examples
8. **Documentation**: Swagger for API, JSDoc comments

## 📊 Demonstrating the API

1. **Show Swagger UI**: Navigate to http://localhost:3000/api/docs
2. **Test endpoints directly** in Swagger
3. **Show real-time updates** in frontend

## 🎤 Sample Interview Responses

**Q: "Walk me through how a request flows through your application"**

A: "Let's take creating a user:
1. Request hits the `UserController` in the presentation layer
2. Controller validates the DTO and calls `CreateUserUseCase`
3. Use case checks business rules (email uniqueness) using the repository interface
4. If valid, creates a `User` domain entity which validates itself
5. Passes entity to repository for persistence
6. Repository implementation uses Prisma to save to database
7. Returns through the layers, converting to DTO for the response
8. Each layer has a specific responsibility and can be tested independently"

**Q: "How would you add authentication?"**

A: "I'd:
1. Add password hash field to User entity with validation method
2. Create `LoginUseCase` and `RegisterUseCase` in application layer
3. Implement JWT service in infrastructure layer
4. Add auth guards in presentation layer
5. Business logic stays in domain, technical details in infrastructure"

**Q: "Why not just use a simple CRUD structure?"**

A: "For simple apps, CRUD is fine. But DDD shines when:
- Business logic gets complex
- Multiple developers work on the code
- Requirements change frequently
- The app needs to scale
- You want to demonstrate professional practices

For interviews, it shows I understand software architecture beyond basic CRUD."

## 🛠️ Quick Debugging

### Backend not starting?
```bash
# Check port
lsof -ti:3000 | xargs kill -9

# Reset database
make migrate-reset

# Check logs
cd backend && yarn start:dev
```

### Frontend not connecting to backend?
```bash
# Check backend health
curl http://localhost:3000/api/health

# Verify .env file
cat frontend/.env
# Should have: VITE_API_URL=http://localhost:3000/api
```

### Tests failing?
```bash
# Regenerate Prisma client
cd backend && npx prisma generate

# Clear test cache
cd frontend && yarn test --clearCache
```

## 📝 Checklist Before Interview

- [ ] Repository is cloned and set up
- [ ] Both servers start successfully
- [ ] Can create a user via Swagger
- [ ] Frontend displays users
- [ ] Understand the layer structure
- [ ] Can explain use case pattern
- [ ] Know how to add a new entity
- [ ] Prepared to discuss trade-offs
- [ ] Have run the tests

## 🚀 Speed Optimization Tips

### During Interview
1. **Have boilerplate ready**: Keep template files for new entities
2. **Use file search**: `Cmd+P` in VS Code to quickly navigate
3. **Copy-paste-modify**: Don't write from scratch, adapt existing code
4. **Focus on business logic**: Spend time on the interesting parts
5. **Use Makefile commands**: `make test`, `make start`, etc.

### Pre-Interview Preparation
```bash
# Create boilerplate templates
mkdir templates
cp backend/src/domain/entities/user.entity.ts templates/entity.template.ts
cp backend/src/application/use-cases/create-user.use-case.ts templates/use-case.template.ts
# etc.
```

## 💡 Final Tips

1. **Start simple**: Get basic CRUD working first, then add features
2. **Explain as you code**: Interviewers want to understand your thought process
3. **Ask clarifying questions**: Before implementing, confirm requirements
4. **Show testing**: Write at least one test to demonstrate understanding
5. **Be honest about trade-offs**: No architecture is perfect, discuss pros and cons

---

**Good luck with your interview! 🎯**
