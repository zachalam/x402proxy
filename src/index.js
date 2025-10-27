import express from 'express';
import { paymentMiddleware } from "x402-express";
import morgan from 'morgan';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use Base Sepolia (testnet) for development
const network = "base-sepolia";
const facilitatorObj = { url: "https://x402.org/facilitator" };

// x402 payment middleware configuration
app.use(
  paymentMiddleware(
    '0x3da338E71829128BF05c17146EE8CC7A21e339b9', // your receiving wallet address
    {
      // Protected endpoint for authentication
      "GET /health": {
        price: "$0.10", // Set your desired price
        network: network,
      },
    },
    facilitatorObj
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

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
