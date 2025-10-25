### Dockerfile for CoffeeBara backend (Postgres)
### Build this with context set to the repository root but Render will use the service's root directory.

FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies (only production deps for smaller image)
COPY package.json package-lock.json* ./
RUN npm ci --only=production || npm install --only=production

# Copy source
COPY . .

# Expose port used by the app (Render overrides with $PORT if provided)
EXPOSE 5002

# Use a non-root user for better security (optional)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Start the server
CMD ["node", "server.js"]
