# Dockerfile for Bidex Backend (NestJS)

# Use an official Node.js runtime as a parent image (Alpine for smaller size)
FROM node:20-alpine AS builder

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install app dependencies
# Use --only=production if you don't need dev dependencies for build
RUN npm install

# Bundle app source
COPY . .

# Build the application
RUN npm run build

# Production image
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy only necessary files from builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./

# Expose port 3000
EXPOSE 3000

# Define environment variable (optional, can be set via docker-compose)
# ENV PORT=3000

# Command to run the application
CMD ["node", "dist/main"]

