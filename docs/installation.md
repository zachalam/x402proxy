# Installation

## Prerequisites

- **Docker** and **Docker Compose** (recommended)
- Or **Node.js 18+** and **npm 9+** for local development

## Quick Installation

### Using Docker (Recommended)

1. **Download the starter config:**
   ```bash
   curl -o custom-config.json https://raw.githubusercontent.com/zachalam/x402proxy/refs/heads/main/custom-config.json
   ```

2. **Run the container:**
   ```bash
   docker run -p 8080:8080 \
     -v $(pwd)/custom-config.json:/app/config.json:ro \
     ghcr.io/zachalam/x402proxy:latest
   ```

3. **Verify it's running:**
   ```bash
   curl http://localhost:8080/health
   ```

### Using Docker Compose

1. **Create a `docker-compose.yml` file:**
   ```yaml
   version: '3.8'
   services:
     x402proxy:
       image: ghcr.io/zachalam/x402proxy:latest
       ports:
         - "8080:8080"
       volumes:
         - ./custom-config.json:/app/config.json:ro
   ```

2. **Start the service:**
   ```bash
   docker-compose up -d
   ```

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/zachalam/x402proxy.git
   cd x402proxy
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create your config file:**
   ```bash
   cp custom-config.json config.json
   # Edit config.json with your settings
   ```

4. **Run in development mode:**
   ```bash
   npm run dev
   ```

## Next Steps

- Configure your endpoints in the [Configuration](configuration.md) section
- Check out [Usage Examples](usage-examples.md) for common scenarios
- Review [Docker Deployment](docker-deployment.md) for production setups

