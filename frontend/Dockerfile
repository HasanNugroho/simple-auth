# 1. Build stage
FROM node:23-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install --production=false
COPY . .
RUN npm run build

# 2. Production stage
FROM node:23-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copy only the necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Expose the port and start the server
EXPOSE 3000
CMD ["npm", "start"]
