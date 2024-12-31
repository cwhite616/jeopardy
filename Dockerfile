# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm install --production

# Copy built assets from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.mjs ./

# Create and copy public directory only if it exists in builder
# RUN mkdir -p ./public
# COPY --from=builder /app/public/* ./public/ 2>/dev/null || true

# Copy env files if they exist
COPY .env ./.env

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]