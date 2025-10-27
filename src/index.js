import express from 'express';
import { paymentMiddleware } from "x402-express";
import morgan from 'morgan';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Load configuration
let config;
const loadConfig = async () => {
  try {
    const configPath = process.env.CONFIG_PATH|| path.join(__dirname, '..', 'config.json');
    console.log(`Loading config from: ${configPath}`);
    const configData = await fs.readFile(configPath, 'utf8');
    config = JSON.parse(configData);
    console.log('Configuration loaded successfully');
    console.log('Config:', JSON.stringify(config, null, 2));
  } catch (error) {
    console.error('Failed to load config.json:', error.message);
    process.exit(1);
  }
};

// Wait for config to load before proceeding
await loadConfig();

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Convert config.protectedEndpoints to the format expected by paymentMiddleware
const protectedEndpoints = {};
if (config.protectedEndpoints) {
  for (const [endpoint, configValue] of Object.entries(config.protectedEndpoints)) {
    protectedEndpoints[endpoint] = {
      price: configValue.price,
      network: config.network,
    };
  }
}

// x402 payment middleware configuration
app.use(
  paymentMiddleware(
    config.paymentAddress,
    protectedEndpoints,
    { url: config.facilitatorUrl }
  )
);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Default route
app.get('/', (req, res) => {
  res.json({
    message: 'x402proxy is running',
    repository: 'https://github.com/zachalam/x402proxy',
    version: '1.0.0'
  });
});

// Create routes for all protected endpoints
if (config.protectedEndpoints) {
  for (const [endpoint, endpointConfig] of Object.entries(config.protectedEndpoints)) {
    // Parse method and path from endpoint string (e.g., "GET /cat")
    const [method, path] = endpoint.split(' ');
    const methodLower = method.toLowerCase();
    
    console.log(`Registering protected endpoint: ${method} ${path}`);
    
    // Create the route handler
    app[methodLower](path, async (req, res) => {
      // Return the paid status
      res.json({ paid: true });
    });
  }
}

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Network: ${config.network}`);
  console.log(`Default price: ${config.defaultPrice}`);
});

export default app;
