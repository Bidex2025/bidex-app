# Dockerfile for Bidex Frontend (Next.js)

# Base image for building the application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies
# Use --frozen-lockfile for deterministic installs if package-lock.json exists
RUN npm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Set build-time environment variables (if needed, otherwise rely on runtime)
# Example: ARG NEXT_PUBLIC_API_URL
# ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build the Next.js application
RUN npm run build

# Production image
FROM node:20-alpine

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production
# Uncomment the following line if you need to expose a different port
# ENV PORT=3001

# Copy built assets from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Expose the port the app runs on (default for Next.js is 3000, but backend uses it, so Next might use 3001 or another)
# We'll expose 3000 here, but rely on docker-compose to map ports correctly.
EXPOSE 3000

# Command to start the Next.js application in production mode
CMD ["npm", "start"]

