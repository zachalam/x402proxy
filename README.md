# x402proxy

A Node.js Express proxy application with Docker support.

## Getting Started

### Prerequisites
- Docker and Docker Compose

### GitHub Container Registry

The application is automatically built and pushed to GitHub Container Registry (ghcr.io) on every push to the main branch.

Pull and run the latest image:

```bash
docker pull ghcr.io/zachalam/x402proxy:latest
docker run -p 3000:3000 ghcr.io/zachalam/x402proxy:latest

# Using CONFIG_PATH environment variable
docker run -p 3000:3000 \
  -v /path/to/custom-config.json:/app/custom-config.json:ro \
  -e CONFIG_PATH=/app/custom-config.json \
  ghcr.io/zachalam/x402proxy:latest
```


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

**Note:** The `config.json` file is automatically mounted and loaded when the container starts.

#### Using a Custom Config Path

You can specify a custom config file path using the `CONFIG` environment variable:

```bash
# Using environment variable for custom config
CONFIG=/path/to/custom-config.json npm start

# With Docker Compose
docker-compose run -e CONFIG=/app/custom-config.json app
```

### Configuration

The application loads configuration from `config.json` in the root directory (or from the path specified by the `CONFIG` environment variable). The configuration includes:

- `facilitatorUrl` - The X402 facilitator URL
- `network` - Blockchain network (e.g., "base-sepolia")
- `paymentAddress` - Receiving wallet address
- `defaultPrice` - Default payment price
- `protectedEndpoints` - Map of protected endpoints with prices and forwarding URLs

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
- `CONFIG_PATH` - Path to a config.json file (default: ./config.json)

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
