import express from 'express';
import { paymentMiddleware } from "x402-express";
import morgan from 'morgan';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

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
      price: configValue.price || config.defaultPrice,
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
      try {
        // If forwardTo is defined, proxy the request
        if (endpointConfig.forwardTo) {
          console.log(`Proxying request to: ${endpointConfig.forwardTo}`);
          
          // Build proxy config
          const proxyConfig = {
            method: method,
            url: endpointConfig.forwardTo,
            validateStatus: () => true, // Don't throw on any status
            // Only include request body for methods that support it
            ...(['POST', 'PUT', 'PATCH'].includes(method) && req.body ? { data: req.body } : {}),
          };
          
          // Forward only safe headers (exclude problematic ones)
          const headersToForward = {};
          const safeHeaders = ['content-type', 'authorization', 'x-requested-with', 'accept', 'user-agent'];
          for (const header of safeHeaders) {
            if (req.headers[header]) {
              headersToForward[header] = req.headers[header];
            }
          }
          
          if (Object.keys(headersToForward).length > 0) {
            proxyConfig.headers = headersToForward;
          }
          
          console.log(`Proxy config:`, { method, url: endpointConfig.forwardTo, hasBody: !!proxyConfig.data, headers: Object.keys(headersToForward) });
          
          // Forward the request using axios
          const forwardResponse = await axios(proxyConfig);
          
          // Set the status code
          res.status(forwardResponse.status);
          
          // Forward response headers (but not problematic ones)
          if (forwardResponse.headers) {
            const responseHeadersToForward = {};
            const safeResponseHeaders = ['content-type', 'content-encoding', 'cache-control', 'etag', 'last-modified'];
            for (const header of safeResponseHeaders) {
              if (forwardResponse.headers[header]) {
                responseHeadersToForward[header] = forwardResponse.headers[header];
              }
            }
            
            Object.keys(responseHeadersToForward).forEach(key => {
              res.setHeader(key, responseHeadersToForward[key]);
            });
          }
          
          // Return the response data
          res.send(forwardResponse.data);
        } else {
          // No forwardTo configured, just return paid status
          res.json({ paid: true });
        }
      } catch (error) {
        console.error(`Error proxying to ${endpointConfig.forwardTo}:`, error.message);
        console.error('Error details:', error.response?.status, error.response?.data);
        res.status(502).json({ 
          error: 'Failed to forward request',
          message: error.message,
          details: error.response?.data 
        });
      }
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
