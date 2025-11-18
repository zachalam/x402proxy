import express from 'express';
import { paymentMiddleware } from "x402-express";
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Load configuration
let config;
const loadConfig = async () => {
  try {
    // Always expect the configuration to be mounted at /app/config.json
    const configPath = '/app/config.json';
    console.log(`Loading config from: ${configPath}`);
    const configData = await fs.readFile(configPath, 'utf8');
    config = JSON.parse(configData);
    console.log('Configuration loaded successfully');
    console.log('Config:', JSON.stringify(config, null, 2));
  } catch (error) {
    console.error('Failed to load /app/config.json:', error.message);
    console.error('Ensure you mount your config file to /app/config.json');
    process.exit(1);
  }
};

// Wait for config to load before proceeding
await loadConfig();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Convert config.protectedEndpoints to the format expected by paymentMiddleware
// Extract only the path from endpoint strings (e.g., "GET /cat" -> "/cat")
const protectedEndpoints = {};
if (config.protectedEndpoints) {
  for (const [endpoint, configValue] of Object.entries(config.protectedEndpoints)) {
    // Split endpoint to extract path (e.g., "GET /cat" -> "/cat")
    const parts = endpoint.split(' ');
    const path = parts.length > 1 ? parts.slice(1).join(' ') : parts[0];
    
    protectedEndpoints[path] = {
      price: configValue.price || config.defaultPrice,
      network: config.network,
    };
  }
}

console.log(`protectedEndpoints: ${JSON.stringify(protectedEndpoints, null, 2)}`);

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
    website: 'https://x402proxy.org'
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
  console.log(`x402proxy is running. More info available at => x402proxy.org`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Network: ${config.network}`);
  console.log(`Default price: ${config.defaultPrice}`);
});

export default app;
