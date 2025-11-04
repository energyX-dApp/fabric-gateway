# =============================
# CO2-API Dockerfile
# =============================

# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /workspace

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy all project files
COPY . .

# Expose the API port
EXPOSE 8000

# Use environment variables from .env (when using docker compose)
# Start the server on configured PORT (defaults to 8000)
ENV PORT=8000
CMD ["npm", "start"]
