![x402proxy](images/x402proxy.png)

# x402proxy

A plug-and-play proxy that accepts x402 payments. Set up in minutes and start selling one-time access to any API - whether it's a new service you're building or an existing API you want to monetize.

🌐 **Multi-chain support** - Works with Ethereum, Base, Solana, and more  
💰 **Direct payments** - Paywall any URL; payment straight to your wallet  
🏗️ **Flexible pricing** - Set one-time global or per-route pricing  
🔌 **Plug & play** - Works with any x402 facilitator

```
[Client] → [x402proxy] → [Any API]
              ↓
         [facilitator]
```

## Getting Started

### Prerequisites
- Docker and Docker Compose

### Quick Start - 2 easy steps
**Step 1.** Download a starter config, modify as needed. (format definition below)
```bash
curl -o custom-config.json https://raw.githubusercontent.com/zachalam/x402proxy/refs/heads/main/custom-config.json
```

**Step 2.** Mount your config to /app/config.json and run the image.
```bash
docker run -p 8080:8080 \
  -v $(pwd)/custom-config.json:/app/config.json:ro \
  ghcr.io/zachalam/x402proxy:latest
```

### Configuration

The application loads configuration strictly from `/app/config.json` inside the container. If this file is not mounted, the container will exit with an error. The configuration includes:

- `facilitatorUrl` - The X402 facilitator URL
- `network` - Blockchain network (e.g., "base-sepolia")
- `paymentAddress` - Receiving wallet address
- `defaultPrice` - Default payment price for all routes
- `protectedEndpoints` - Map of protected endpoints with prices and forwarding URLs

**Sample config (custom-config.json):**

```json
{
  "facilitatorUrl": "https://x402.org/facilitator",
  "network": "base-sepolia",
  "paymentAddress": "0x5629562956295629562956295629562956295629",
  "defaultPrice": "$0.05",
  "protectedEndpoints": {
    "GET /cat": {
      "forwardTo": "https://api.thecatapi.com/v1/images/search"
    },
    "GET /dog": {
      "price": "$0.10",
      "forwardTo": "https://api.thedogapi.com/v1/images/search"
    },
    "GET /fact": {
      "price": "$0.15",
      "forwardTo": "https://catfact.ninja/fact"
    },
    "GET /joke": {
      "price": "$0.20",
      "forwardTo": "https://official-joke-api.appspot.com/random_joke"
    }
  }
}
```

**Tip for large configs:** For large `protectedEndpoints` configurations, file mounting is recommended (no size limits).

### GitHub Container Registry

The application is automatically built and pushed to GitHub Container Registry (ghcr.io) on every push to the main branch. Each push creates a new version tagged with an auto-incremented version number and also tagged as `latest`.

Pull and run the latest image:

```bash
docker pull ghcr.io/zachalam/x402proxy:latest

# Run (config must be mounted to /app/config.json)
docker run -p 8080:8080 \
  -v $(pwd)/custom-config.json:/app/config.json:ro \
  ghcr.io/zachalam/x402proxy:latest

# Use different external port
docker run -p 4020:8080 -e PORT=8080 \
  -v $(pwd)/custom-config.json:/app/config.json:ro \
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

**Note:** You must mount your config to `/app/config.json`. If the file is missing, the container will exit with an error.

### Architecture

- **Development (docker-compose.yml)**: Uses nodemon for hot reload, mounts source code as volume
- **Production (Dockerfile)**: Optimized image with only production dependencies, runs as non-root user

## License
ISC
