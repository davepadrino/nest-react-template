.PHONY: help install install-all start start-backend start-backend-local start-frontend stop logs build build-backend build-backend-local build-frontend test test-backend test-frontend test-cov test-cov-backend test-cov-frontend lint lint-backend lint-frontend format clean migrate-dev migrate-reset db-studio

# Default target
help:
	@echo "Available commands:"
	@echo "  make install          - Install frontend dependencies (backend uses Docker)"
	@echo "  make install-all      - Install ALL dependencies including backend (for local dev)"
	@echo "  make start            - Start backend (Docker) and frontend (local)"
	@echo "  make start-backend    - Start backend in Docker with hot-reload"
	@echo "  make start-backend-local - Start backend locally (no Docker)"
	@echo "  make start-frontend   - Start only frontend in development mode"
	@echo "  make stop             - Stop backend Docker containers"
	@echo "  make build            - Build both backend and frontend"
	@echo "  make test             - Run tests for both backend and frontend"
	@echo "  make test-cov         - Run tests with coverage report"
	@echo "  make lint             - Run linter for both projects"
	@echo "  make format           - Format code using Prettier"
	@echo "  make logs             - View backend Docker logs"
	@echo "  make migrate-dev      - Run database migrations (development)"
	@echo "  make migrate-reset    - Reset database and migrations"
	@echo "  make db-studio        - Open Prisma Studio"
	@echo "  make db-seed          - Seed the database with sample data"
	@echo "  make clean            - Clean all dependencies and build artifacts"

# Installation
install:
	@echo "📦 Installing root dependencies..."
	yarn install
	@echo "📦 Installing frontend dependencies..."
	cd frontend && yarn install
	@echo "✅ Dependencies installed!"

install-all:
	@echo "📦 Installing ALL dependencies (root, backend, frontend)..."
	yarn install
	@echo "📦 Installing backend dependencies..."
	cd backend && yarn install
	@echo "📦 Installing frontend dependencies..."
	cd frontend && yarn install
	@echo "✅ All dependencies installed!"

# Development
start:
	@echo "🚀 Starting backend (Docker) and frontend (local)..."
	@make start-backend
	@sleep 5
	@make start-frontend

start-backend:
	@echo "🚀 Starting backend in Docker on port 3000..."
	@docker-compose up -d
	@echo "✅ Backend started in Docker!"
	@echo "📝 Backend API: http://localhost:3000"
	@echo "📚 API Docs: http://localhost:3000/api/docs"
	@echo "💡 View logs: make logs"

start-backend-local:
	@echo "🚀 Starting backend locally on port 3000..."
	cd backend && yarn start:dev

start-frontend:
	@echo "🚀 Starting frontend locally on port 3001..."
	cd frontend && yarn dev

stop:
	@echo "🛑 Stopping backend Docker containers..."
	@docker-compose down
	@echo "✅ Backend stopped!"

logs:
	@echo "📋 Showing backend logs (Ctrl+C to exit)..."
	@docker-compose logs -f backend

# Build
build:
	@echo "🏗️  Building projects..."
	@make build-backend
	@make build-frontend
	@echo "✅ Build complete!"

build-backend:
	@echo "🏗️  Building backend Docker image..."
	@docker-compose build

build-backend-local:
	@echo "🏗️  Building backend locally..."
	cd backend && yarn build

build-frontend:
	@echo "🏗️  Building frontend..."
	cd frontend && yarn build

# Testing
test:
	@echo "🧪 Running tests..."
	@make test-backend
	@make test-frontend
	@echo "✅ All tests passed!"

test-backend:
	@echo "🧪 Running backend tests..."
	cd backend && yarn test

test-frontend:
	@echo "🧪 Running frontend tests..."
	cd frontend && yarn test

test-watch:
	@echo "👀 Running tests in watch mode..."
	@make -j 2 test-watch-backend test-watch-frontend

test-watch-backend:
	cd backend && yarn test:watch

test-watch-frontend:
	cd frontend && yarn test:watch

test-cov:
	@echo "🧪 Running tests with coverage..."
	@make test-cov-backend
	@echo ""
	@make test-cov-frontend
	@echo "✅ Coverage reports generated!"
	@echo "📂 Backend: backend/coverage/lcov-report/index.html"
	@echo "📂 Frontend: frontend/coverage/lcov-report/index.html"

test-cov-backend:
	@echo "📊 Running backend tests with coverage..."
	cd backend && yarn test:cov

test-cov-frontend:
	@echo "📊 Running frontend tests with coverage..."
	cd frontend && yarn test --coverage --watchAll=false

# Code Quality
lint:
	@echo "🔍 Running linters..."
	@make lint-backend
	@make lint-frontend
	@echo "✅ Linting complete!"

lint-backend:
	@echo "🔍 Linting backend..."
	cd backend && yarn lint

lint-frontend:
	@echo "🔍 Linting frontend..."
	cd frontend && yarn lint

format:
	@echo "✨ Formatting code..."
	yarn format
	@echo "✅ Code formatted!"

# Database
migrate-dev:
	@echo "🗄️  Running database migrations in Docker..."
	@docker-compose exec backend yarn prisma migrate dev
	@echo "✅ Migrations complete!"

migrate-reset:
	@echo "⚠️  Resetting database in Docker..."
	@docker-compose exec backend yarn prisma migrate reset --force
	@echo "✅ Database reset complete!"

migrate-deploy:
	@echo "🚀 Deploying migrations in Docker..."
	@docker-compose exec backend yarn prisma migrate deploy
	@echo "✅ Migrations deployed!"

db-studio:
	@echo "🎨 Opening Prisma Studio in Docker..."
	@echo "📝 Studio will be available at: http://localhost:5555"
	@docker-compose exec backend yarn prisma studio

db-seed:
	@echo "🌱 Seeding database in Docker..."
	@docker-compose exec backend yarn prisma:seed
	@echo "✅ Database seeded!"

db-generate:
	@echo "⚙️  Generating Prisma Client in Docker..."
	@docker-compose exec backend yarn prisma generate
	@echo "✅ Prisma Client generated!"

clean:
	@echo "🧹 Cleaning dependencies and build artifacts..."
	rm -rf node_modules backend/node_modules frontend/node_modules
	rm -rf backend/dist frontend/dist frontend/build
	rm -rf backend/coverage frontend/coverage
	rm -f backend/dev.db backend/dev.db-journal
	@echo "✅ Clean complete!"

# Setup (for first time setup)
setup: install
	@echo "🔨 Building backend Docker image..."
	@make build-backend
	@echo "🚀 Starting backend in Docker..."
	@docker-compose up -d
	@echo "⏳ Waiting for backend to be ready..."
	@sleep 10
	@echo "🗄️  Running database migrations..."
	@make migrate-dev
	@echo "🌱 Seeding database..."
	@make db-seed
	@echo "✅ Project setup complete!"
	@echo ""
	@echo "📝 Backend: http://localhost:3000"
	@echo "📝 Frontend: http://localhost:3001"
	@echo "📚 API Docs: http://localhost:3000/api/docs"
	@echo ""
	@echo "💡 Run 'make logs' to watch the backend logs"
	@echo "💡 Run 'make start-frontend' to start the frontend"
	@echo "💡 Run 'make stop' to stop the backend"

setup-local: install-all db-generate migrate-dev db-seed
	@echo "✅ Local setup complete!"
	@echo "📝 Run 'make start-backend-local' and 'make start-frontend' to start"
