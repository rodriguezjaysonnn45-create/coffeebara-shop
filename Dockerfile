### Root Dockerfile for CoffeeBara backend
### This Dockerfile copies the `server/` folder into the image and starts the server.

FROM node:20-alpine

WORKDIR /usr/src/app

# Copy server package manifest and install production deps
COPY server/package.json server/package-lock.json* ./
RUN npm ci --only=production || npm install --only=production

# Copy server source into the image
COPY server/ .

# Expose the port the app listens on (Render provides $PORT at runtime)
EXPOSE 5002

# Non-root user for improved security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Start the server
CMD ["node", "server.js"]
