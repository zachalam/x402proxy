# x402proxy

A Node.js Express proxy application with Docker support.

## Getting Started

### Prerequisites

- Node.js 18+ (LTS)
- Docker and Docker Compose
- npm 9+

### Local Development

#### Without Docker

```bash
# Install dependencies
npm install

# Run in development mode with nodemon
npm run dev

# Run in production mode
npm start
```

#### With Docker

```bash
# Build and run the development container with hot reload
docker-compose up

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

The application will be available at `http://localhost:3000`

### Production

#### Build the production image

```bash
docker build -t x402proxy:latest .
```

#### Run the production container

```bash
docker run -p 3000:3000 --name x402proxy x402proxy:latest
```

### Scripts

- `npm start` - Run the application in production mode
- `npm run dev` - Run the application in development mode with nodemon
- `npm run lint` - Lint the codebase

### Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

### Health Check

The application includes a health check endpoint:

```
GET /health
```

### Architecture

- **Development (docker-compose.yml)**: Uses nodemon for hot reload, mounts source code as volume
- **Production (Dockerfile)**: Optimized image with only production dependencies, runs as non-root user

## License

ISC
