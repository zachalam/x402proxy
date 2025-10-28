# x402proxy

A plug-and-play proxy that accepts x402 payments. Set up in minutes and start selling one-time access to any API - whether it's a new service you're building or an existing API you want to monetize.

## Getting Started

### Prerequisites
- Docker and Docker Compose

### Quick Start - Under 60 Seconds
**Step 1.** Download config.json (customize if needed)
```bash
curl -o custom-config.json https://raw.githubusercontent.com/zachalam/x402proxy/refs/heads/main/config.json
```

**Step 2.** Mount config and run docker
```bash
docker run -p 8080:8080 \
  -v $(pwd)/custom-config.json:/app/custom-config.json:ro \
  -e CONFIG_PATH=/app/custom-config.json \
  ghcr.io/zachalam/x402proxy:latest
```

### Configuration

The application loads configuration from `config.json` in the root directory (or from the path specified by the `CONFIG_PATH` environment variable). The configuration includes:

**Tip for large configs:** For large `protectedEndpoints` configurations, file mounting is recommended (no size limits):

- `facilitatorUrl` - The X402 facilitator URL
- `network` - Blockchain network (e.g., "base-sepolia")
- `paymentAddress` - Receiving wallet address
- `defaultPrice` - Default payment price
- `protectedEndpoints` - Map of protected endpoints with prices and forwarding URLs

### GitHub Container Registry

The application is automatically built and pushed to GitHub Container Registry (ghcr.io) on every push to the main branch. Each push creates a new version tagged with an auto-incremented version number and also tagged as `latest`.

Pull and run the latest image:

```bash
# Basic usage (uses built-in config.json from image)
docker pull ghcr.io/zachalam/x402proxy:latest
docker run -p 8080:8080 ghcr.io/zachalam/x402proxy:latest

# Use different external port
docker run -p 4020:8080 -e PORT=8080 ghcr.io/zachalam/x402proxy:latest
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

# The application will be available at http://localhost:3000
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

# The application will be available at http://localhost:3000
```

**Note:** The `config.json` file is automatically mounted and loaded when the container starts.

### Architecture

- **Development (docker-compose.yml)**: Uses nodemon for hot reload, mounts source code as volume
- **Production (Dockerfile)**: Optimized image with only production dependencies, runs as non-root user

## License
ISC
