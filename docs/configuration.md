# Configuration

x402proxy uses a simple JSON configuration file to define protected endpoints, pricing, and payment settings.

## Config File Structure

The configuration file must be mounted to `/app/config.json` inside the container (or placed in the project root for local development).

### Required Fields

| Field | Description | Example |
|-------|-------------|---------|
| `facilitatorUrl` | The x402 facilitator URL | `"https://x402.org/facilitator"` |
| `network` | Blockchain network identifier | `"base-sepolia"` |
| `paymentAddress` | Your wallet address to receive payments | `"0x5629562956295629562956295629562956295629"` |
| `defaultPrice` | Default payment price for all routes | `"$0.05"` |
| `protectedEndpoints` | Map of protected endpoints | See below |

## Protected Endpoints

The `protectedEndpoints` object maps endpoint definitions to their configuration:

```json
{
  "protectedEndpoints": {
    "GET /cat": {
      "forwardTo": "https://api.thecatapi.com/v1/images/search"
    },
    "GET /dog": {
      "price": "$0.10",
      "forwardTo": "https://api.thedogapi.com/v1/images/search"
    }
  }
}
```

### Endpoint Format

- **Method and Path**: `"METHOD /path"` (e.g., `"GET /cat"`, `"POST /api/data"`)
- **forwardTo**: The URL to proxy requests to (required if you want to proxy)
- **price**: Optional per-route price (overrides `defaultPrice`)

## Pricing

### Global Pricing

Set a default price that applies to all endpoints:

```json
{
  "defaultPrice": "$0.05"
}
```

### Per-Route Pricing

Override the default price for specific endpoints:

```json
{
  "protectedEndpoints": {
    "GET /premium": {
      "price": "$0.50",
      "forwardTo": "https://api.example.com/premium"
    }
  }
}
```

## Complete Example

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
    }
  }
}
```

## Network Options

Common network identifiers:

- `"base-sepolia"` - Base Sepolia testnet
- `"base"` - Base mainnet
- `"ethereum"` - Ethereum mainnet
- `"sepolia"` - Ethereum Sepolia testnet
- `"solana"` - Solana mainnet

Check with your x402 facilitator for supported networks.

