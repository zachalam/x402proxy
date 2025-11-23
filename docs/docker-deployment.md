# Docker Deployment

## Production Deployment

### Basic Docker Run

```bash
docker run -d \
  --name x402proxy \
  -p 8080:8080 \
  -v $(pwd)/custom-config.json:/app/config.json:ro \
  ghcr.io/zachalam/x402proxy:latest
```

### Docker Compose

Create a `docker-compose.yml`:

```yaml
version: '3.8'

services:
  x402proxy:
    image: ghcr.io/zachalam/x402proxy:latest
    container_name: x402proxy
    ports:
      - "8080:8080"
    volumes:
      - ./custom-config.json:/app/config.json:ro
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - PORT=8080
```

Start with:
```bash
docker-compose up -d
```

## Custom Port

Map to a different external port:

```bash
docker run -p 4020:8080 \
  -v $(pwd)/custom-config.json:/app/config.json:ro \
  ghcr.io/zachalam/x402proxy:latest
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Internal container port | `8080` |
| `NODE_ENV` | Environment mode | `production` |

## Volume Mounts

### Required

- **Config file**: `./custom-config.json:/app/config.json:ro`
  - Must be mounted to `/app/config.json`
  - Container will exit if file is missing

### Optional

- **CA Certificate**: `./ca-cert.pem:/app/CA_CERT:ro`
  - For custom SSL/TLS certificates
  - See [Troubleshooting](troubleshooting.md) for SSL issues

## Health Checks

Monitor container health:

```bash
# Check health endpoint
curl http://localhost:8080/health

# Check container status
docker ps | grep x402proxy

# View logs
docker logs x402proxy
```

## Updating

Pull the latest image and restart:

```bash
docker pull ghcr.io/zachalam/x402proxy:latest
docker-compose down
docker-compose up -d
```

## Security Considerations

- The container runs as a non-root user (`nodejs`)
- Config file is mounted read-only (`:ro`)
- Only port 8080 is exposed by default
- Use Docker secrets or environment variables for sensitive data

