# Stage 1: Builder
FROM node:23-alpine AS builder

WORKDIR /app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy seluruh kode sumber
COPY . .

# Build aplikasi
RUN npm run build

# Stage 2: Production image
FROM node:23-alpine

WORKDIR /app

# Copy hasil build dan package.json dari builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install hanya dependencies production
RUN npm ci --omit=dev

# Jalankan aplikasi
CMD ["node", "dist/index.js"]
