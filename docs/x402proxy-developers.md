# x402proxy Developers

This section is for developers who want to contribute to x402proxy or run it locally for development.

## Prerequisites

- **Node.js 18+** and **npm 9+**
- **Git** (for cloning the repository)

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/zachalam/x402proxy.git
cd x402proxy
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Configuration File

```bash
cp custom-config.json config.json
# Edit config.json with your settings
```

**Note:** For local development, you'll need to update the config path in `src/index.js` or create a symlink, as the code expects `/app/config.json` by default (Docker path).

### 4. Run in Development Mode

```bash
npm run dev
```

This uses `nodemon` for hot reload, so changes to `src/index.js` will automatically restart the server.

### 5. Run in Production Mode

```bash
npm start
```

## Development with Docker

### Using Docker Compose

For a consistent development environment using Docker Compose:

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

3. **View logs:**
   ```bash
   docker-compose logs -f
   ```

4. **Stop the container:**
   ```bash
   docker-compose down
   ```

The development Docker setup includes:
- Hot reload with nodemon (when using Dockerfile.dev)
- Source code mounted as volume
- Config file mounted from `custom-config.json`

## Project Structure

```
x402proxy/
├── src/
│   └── index.js          # Main application file
├── docs/                 # GitBook documentation
├── web/                   # Website files
├── Dockerfile             # Production Docker image
├── Dockerfile.dev         # Development Docker image
├── docker-compose.yml     # Docker Compose configuration
├── package.json          # Node.js dependencies
└── custom-config.json    # Example configuration
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Run the application in production mode |
| `npm run dev` | Run with nodemon for hot reload |
| `npm run lint` | Run ESLint on source code |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## Building Docker Images

### Production Image

```bash
docker build -t x402proxy:latest -f Dockerfile .
```

### Development Image

```bash
docker build -t x402proxy:dev -f Dockerfile.dev .
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `8080` |
| `NODE_ENV` | Environment mode | `production` |
| `NODE_TLS_REJECT_UNAUTHORIZED` | Disable SSL verification (dev only) | `1` |

## Testing

Currently, there are no automated tests. Manual testing can be done by:

1. Starting the server
2. Making requests to protected endpoints
3. Verifying payment flow
4. Checking proxy functionality

## Troubleshooting Development Issues

### Config File Not Found

If you see "Failed to load /app/config.json", you're running locally but the code expects the Docker path. Options:

1. Create a symlink: `ln -s $(pwd)/config.json /app/config.json` (requires sudo)
2. Modify `src/index.js` to use a local path for development
3. Use Docker for development instead

### Port Already in Use

Change the port:

```bash
PORT=3000 npm run dev
```

### Module Not Found

Ensure dependencies are installed:

```bash
npm install
```

