#!/bin/bash

# Script to generate a new entity following DDD architecture
# Usage: ./scripts/generate-entity.sh EntityName

set -e

if [ -z "$1" ]; then
  echo "Usage: ./scripts/generate-entity.sh EntityName"
  echo "Example: ./scripts/generate-entity.sh Product"
  exit 1
fi

ENTITY_NAME=$1
ENTITY_LOWER=$(echo "$ENTITY_NAME" | tr '[:upper:]' '[:lower:]')
ENTITY_PLURAL="${ENTITY_LOWER}s"

echo "🚀 Generating entity: $ENTITY_NAME"
echo "📝 Entity name: $ENTITY_NAME"
echo "📝 Lowercase: $ENTITY_LOWER"
echo "📝 Plural: $ENTITY_PLURAL"
echo ""

# Backend directories
BACKEND_DIR="backend/src"
DOMAIN_DIR="$BACKEND_DIR/domain"
APP_DIR="$BACKEND_DIR/application"
INFRA_DIR="$BACKEND_DIR/infrastructure"
PRES_DIR="$BACKEND_DIR/presentation"
MOD_DIR="$BACKEND_DIR/modules"

echo "✅ Creating backend structure..."

# Create directories
mkdir -p "$DOMAIN_DIR/entities"
mkdir -p "$DOMAIN_DIR/repositories"
mkdir -p "$APP_DIR/use-cases"
mkdir -p "$APP_DIR/dtos"
mkdir -p "$INFRA_DIR/repositories"
mkdir -p "$PRES_DIR/controllers"
mkdir -p "$MOD_DIR"

echo "📄 Backend files to create:"
echo "  - $DOMAIN_DIR/entities/${ENTITY_LOWER}.entity.ts"
echo "  - $DOMAIN_DIR/repositories/${ENTITY_LOWER}.repository.interface.ts"
echo "  - $APP_DIR/dtos/create-${ENTITY_LOWER}.dto.ts"
echo "  - $APP_DIR/dtos/update-${ENTITY_LOWER}.dto.ts"
echo "  - $APP_DIR/dtos/${ENTITY_LOWER}-response.dto.ts"
echo "  - $APP_DIR/use-cases/create-${ENTITY_LOWER}.use-case.ts"
echo "  - $APP_DIR/use-cases/get-all-${ENTITY_PLURAL}.use-case.ts"
echo "  - $APP_DIR/use-cases/get-${ENTITY_LOWER}-by-id.use-case.ts"
echo "  - $APP_DIR/use-cases/update-${ENTITY_LOWER}.use-case.ts"
echo "  - $APP_DIR/use-cases/delete-${ENTITY_LOWER}.use-case.ts"
echo "  - $INFRA_DIR/repositories/${ENTITY_LOWER}.repository.ts"
echo "  - $PRES_DIR/controllers/${ENTITY_LOWER}.controller.ts"
echo "  - $MOD_DIR/${ENTITY_LOWER}.module.ts"
echo ""

# Frontend directories
FRONTEND_DIR="frontend/src"
FE_DOMAIN_DIR="$FRONTEND_DIR/domain"
FE_APP_DIR="$FRONTEND_DIR/application"
FE_INFRA_DIR="$FRONTEND_DIR/infrastructure"
FE_PRES_DIR="$FRONTEND_DIR/presentation"

echo "✅ Creating frontend structure..."

mkdir -p "$FE_DOMAIN_DIR/entities"
mkdir -p "$FE_DOMAIN_DIR/repositories"
mkdir -p "$FE_APP_DIR/use-cases"
mkdir -p "$FE_APP_DIR/dtos"
mkdir -p "$FE_INFRA_DIR/repositories"
mkdir -p "$FE_PRES_DIR/components"
mkdir -p "$FE_PRES_DIR/pages"

echo "📄 Frontend files to create:"
echo "  - $FE_DOMAIN_DIR/entities/${ENTITY_NAME}.ts"
echo "  - $FE_DOMAIN_DIR/repositories/I${ENTITY_NAME}Repository.ts"
echo "  - $FE_APP_DIR/dtos/${ENTITY_NAME}DTO.ts"
echo "  - $FE_APP_DIR/use-cases/GetAll${ENTITY_PLURAL}.UseCase.ts"
echo "  - $FE_APP_DIR/use-cases/Get${ENTITY_NAME}ById.UseCase.ts"
echo "  - $FE_APP_DIR/use-cases/Create${ENTITY_NAME}.UseCase.ts"
echo "  - $FE_APP_DIR/use-cases/Update${ENTITY_NAME}.UseCase.ts"
echo "  - $FE_APP_DIR/use-cases/Delete${ENTITY_NAME}.UseCase.ts"
echo "  - $FE_INFRA_DIR/repositories/${ENTITY_NAME}Repository.ts"
echo "  - $FE_PRES_DIR/components/${ENTITY_NAME}Card.tsx"
echo "  - $FE_PRES_DIR/components/${ENTITY_NAME}Form.tsx"
echo "  - $FE_PRES_DIR/pages/${ENTITY_NAME}ListPage.tsx"
echo ""

echo "⚠️  Manual steps required:"
echo "1. Add Prisma model to backend/prisma/schema.prisma:"
echo ""
echo "   model $ENTITY_NAME {"
echo "     id        String   @id @default(uuid())"
echo "     // Add your fields here"
echo "     createdAt DateTime @default(now())"
echo "     updatedAt DateTime @updatedAt"
echo ""
echo "     @@map(\"${ENTITY_PLURAL}\")"
echo "   }"
echo ""
echo "2. Run: make migrate-dev"
echo "3. Implement the generated files (use User entity as reference)"
echo "4. Import module in app.module.ts"
echo "5. Add routes to frontend navigation"
echo ""
echo "✅ Structure created! Follow the manual steps above."
