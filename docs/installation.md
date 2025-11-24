# Installation

## Prerequisites

- **Docker**

## Quick Installation

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

## Next Steps

- Configure your endpoints in the [Configuration](configuration.md) section
- Check out [Usage Examples](usage-examples.md) for common scenarios
- Review [Docker Deployment](docker-deployment.md) for production setups

