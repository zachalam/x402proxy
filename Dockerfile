# Production Dockerfile
FROM node:22

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production && npm cache clean --force

# Copy application files
COPY src/ ./src/

# Copy config.json
COPY config.json ./config.json

# Create non-root user for security
RUN groupadd -g 1001 nodejs && \
    useradd -u 1001 -g nodejs -m -s /bin/bash nodejs && \
    chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 8080


# Start the application
CMD ["node", "src/index.js"]
