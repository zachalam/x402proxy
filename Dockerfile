# Production Dockerfile
FROM node:22

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
# Use npm install instead of npm ci to handle lock file mismatches gracefully
RUN npm install --omit=dev && npm cache clean --force

# Copy application files
COPY src/ ./src/

# Do not bake config into the image; require mounting to /app/config.json

# Create non-root user for security
RUN groupadd -g 1001 nodejs && \
    useradd -u 1001 -g nodejs -m -s /bin/bash nodejs && \
    chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 8080


# Start the application
CMD ["node", "src/index.js"]
