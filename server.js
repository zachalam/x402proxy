import express from 'express';
import { paymentMiddleware } from "x402-express";
import { createProxyMiddleware } from 'http-proxy-middleware';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3000;

// Middleware to parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Read settings.json
const settingsPath = path.join(process.cwd(), 'settings.json');
const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));

// Build payment middleware configuration from routes
const paymentConfig = {};
const routeMapping = {}; // Maps rewriteRoute -> route for proxy forwarding
settings.routes.forEach(route => {
  const endpoint = route.rewriteRoute || route.route;
  paymentConfig[endpoint] = {
    price: route.price || settings.config.defaultPrice,
    network: route.network || settings.config.defaultNetwork,
    config: {
      description: `Access to ${endpoint}`
    }
  };
  // Store mapping for proxy path rewriting
  if (route.rewriteRoute) {
    routeMapping[route.rewriteRoute] = route.route;
  }
});

// Basic route
app.get('/', (req, res) => {
  res.json({ name: 'x402proxy.org', status: 'OK' });
});

// Route validation middleware
const validateRoute = (req, res, next) => {
  const allowedRoutes = settings.routes.map(route => route.rewriteRoute || route.route);
  if (!allowedRoutes.includes(req.path)) {
    return res.status(404).json({
      error: 'Route not found',
      message: `The route '${req.path}' is not in the allowed routes list`,
      allowedRoutes: allowedRoutes,
      status: 'error'
    });
  }
  next();
};

// Create proxy middleware
const proxyMiddleware = createProxyMiddleware({
  target: settings.config.defaultForwardTo,
  changeOrigin: true,
  pathRewrite: (path, req) => {
    // If this path has a rewriteRoute mapping, use the original route
    if (routeMapping[path]) {
      return routeMapping[path];
    }
    // Otherwise keep the path as-is
    return path;
  },
  onProxyReq: (proxyReq, req, res) => {
    const targetPath = routeMapping[req.path] || req.path;
    console.log(`Proxying ${req.method} ${req.path} to ${settings.config.defaultForwardTo}${targetPath}`);
  },
  onError: (err, req, res) => {
    console.error(`Proxy error for ${req.path}:`, err);
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Proxy error',
        originalPath: req.path,
        targetUrl: settings.config.defaultForwardTo,
        status: 'error',
        message: err.message
      });
    }
  }
});

// Create a wrapper middleware that ensures payment completes before proxy
const paymentThenProxy = (req, res, next) => {
  // Check if this is a route that needs payment
  const allowedRoutes = settings.routes.map(route => route.rewriteRoute || route.route);
  if (!allowedRoutes.includes(req.path)) {
    return next(); // Skip payment for non-configured routes
  }

  // Create a flag to track if payment middleware has completed
  let paymentCompleted = false;
  
  // Override res.end to ensure we don't proxy if payment middleware already sent a response
  const originalEnd = res.end;
  res.end = function(...args) {
    paymentCompleted = true;
    return originalEnd.apply(this, args);
  };

  // Apply payment middleware
  const paymentMw = paymentMiddleware(
    settings.config.defaultPaymasterAddress,
    paymentConfig
  );

  paymentMw(req, res, (err) => {
    if (err) {
      return next(err);
    }
    
    // If payment middleware didn't send a response, continue to proxy
    if (!paymentCompleted && !res.headersSent) {
      // Restore original res.end
      res.end = originalEnd;
      return proxyMiddleware(req, res, next);
    }
    
    // Payment middleware already handled the response
    return next();
  });
};

// Apply middleware in correct order:
// 1. Route validation (check if route exists in settings.json)
app.use(validateRoute);

// 2. Apply payment-then-proxy middleware
app.use(paymentThenProxy);

app.listen(port, '0.0.0.0', () => {
  console.log(`x402proxy running at http://0.0.0.0:${port}/`);
});
