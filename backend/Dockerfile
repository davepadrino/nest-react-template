# Development-only Dockerfile
FROM node:18-alpine

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN yarn install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start application in development mode
CMD ["yarn", "start:dev"]
